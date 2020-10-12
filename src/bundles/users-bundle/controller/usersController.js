/**
 *    @Route ("/users")
 */
class usersController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
    // CSRF cross-site request forgery
    this.setCsrfToken(this.bundle.settings.csrfToken.name, {
      secret: this.bundle.settings.csrfToken.secret,
      cookie: this.bundle.settings.csrfToken.cookie
    });
    this.translation = this.get("translation");
    this.usersService = this.get("users");

    this.on("onError", (error, route, variables) => {
      return this.onError(error, route, variables);
    });
  }

  onError(e, route, variables) {
    try {
      if (e.errorType === "csrfError") {
        this.setFlashBag("error", e.message);
        return this.redirectToRoute("nodefony-user", variables);
      }
      throw e;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   */
  headerAction() {
    return this.render("users::header.html.twig", {
      langs: this.get("translation").getLangs(),
      locale: this.getLocale(),
      version: nodefony.version
    });
  }

  /**
   *
   */
  footerAction() {
    let version = this.kernel.settings.version;
    return this.render("users::footer.html.twig", {
      version: version,
      year: new Date().getFullYear()
    });
  }

  /**
   *    @see Route by Annotaion
   *    @Method ({ "GET"})
   *    @Route ("/lang", name="lang")
   */
  langAction() {
    if (this.query.language) {
      if (this.session) {
        this.session.set("lang", this.query.language);
        let route = this.session.getMetaBag("lastRoute");
        if (route) {
          return this.redirect(this.url(route));
        }
      }
    }
    let referer = this.request.getHeader("referer");
    if (referer) {
      return this.redirect(referer);
    }
    return this.redirect("/");
  }

  /**
   *    @Method ({"GET", "POST"})
   *    @Route ( "/create", name="nodefony-user-create")
   *
   */
  createAction() {
    switch (this.method) {
    case "GET":
      let size = Object.keys(this.queryGet).length;
      if (size) {
        if (this.queryGet.roles) {
          this.queryGet.roles = this.queryGet.roles.split(",");
        }
        this.queryGet.password = null;
        this.queryGet.confirm = null;
      }
      return this.render("users:users:createUser.html.twig", {
        langs: this.translation.getLangs(),
        locale: this.getLocale(),
        queryString: size ? this.queryGet : null
      });
    case "POST":
      // FORM DATA
      let error = null;
      if (!this.query.password || !this.query.confirm) {
        error = new Error(`Password can't be empty`);
      }
      if (this.query.password !== this.query.confirm) {
        error = new Error(`Bad confirm password`);
      }
      if (error) {
        this.setFlashBag("error", error.message);
        this.logger(error, "ERROR");
        delete this.query.password;
        delete this.query.confirm;
        return this.redirectToRoute("nodefony-user-create", {
          queryString: this.query
        });
      }
      if (nodefony.typeOf(this.query.roles) === "string") {
        this.query.roles = [this.query.roles];
      }
      this.checkAuthorisation(null, this.query);
      return this.usersService.create(this.query)
        .then((user) => {
          let message = `${this.translate("added", "users")} ${user.username}`;
          this.setFlashBag("info", message);
          this.logger(message, "INFO");
          return this.redirectToRoute("home");
        })
        .catch((error) => {
          //console.log(error)
          this.logger(error, "ERROR");
          this.setFlashBag("error", error.message);
          delete this.query.password;
          delete this.query.confirm;
          return this.redirectToRoute("nodefony-user-create", {
            queryString: this.query
          });
        });
    default:
      throw new Error("Bad Method");
    }
  }

  /**
   *    @Method ({"GET","POST"})
   *    @Route ( "/update/{username}", name="nodefony-user-update")
   */
  updateAction(username) {
    this.checkAuthorisation(username, this.query);
    switch (this.method) {
    case "GET":
      return this.usersService.findOne(username)
        .then((result) => {
          if (result) {
            return this.render("users:users:createUser.html.twig", {
              user: result,
              langs: this.translation.getLangs(),
              locale: this.getLocale()
            });
          }
          throw new Error(`User ${username} not found`);
        }).catch(e => {
          throw e;
        });
    case "POST":
      return this.usersService.findOne(username)
        .then(async (myuser) => {
          if (myuser) {
            if (nodefony.typeOf(this.query.roles) === "string") {
              this.query.roles = [this.query.roles];
            }
            let value = {
              username: this.query.username || null,
              email: this.query.email,
              name: this.query.name,
              surname: this.query.surname,
              gender: this.query.gender,
              roles: this.query.roles || [],
              lang: this.query.lang,
              enabled: this.query.enabled
            };
            if (this.query.password && this.isGranted("ROLE_ADMIN")) {
              let error = null;
              if (this.query.password && this.query.password !== this.query.confirm) {
                error = new Error(`Bad confirm password`);
              }
              if (error) {
                throw error;
              }
              value.password = this.query.password;
            } else {
              if (this.query.password && this.query["old-passwd"]) {
                let encoder = this.getNodefonyEntity("user").getEncoder();
                let check = await encoder.isPasswordValid(this.query["old-passwd"], myuser.password);
                if (check) {
                  value.password = this.query.password;
                } else {
                  throw new Error(`User ${username} bad passport`);
                }
              }
            }
            return this.usersService.update(myuser, value)
              .then(() => {
                let message = `Update User ${this.query.username} OK`;
                this.setFlashBag("info", message);
                this.logger(message, "INFO");
                let currentUser = this.getUser();
                if (myuser.username === currentUser.username) {
                  if (this.query.username !== myuser.username) {
                    currentUser.username = this.query.username;
                  }
                  if (this.getLocale() !== this.query.lang) {
                    this.session.set("lang", this.query.lang);
                  }
                  let token = this.getToken();
                  return token.refreshToken(this.context)
                    .then(() => {
                      return this.redirectToRoute("home");
                    })
                    .catch((error) => {
                      throw error;
                    });
                }
                return this.redirectToRoute("home");
              });
          }
          throw new Error(`User ${username} not found`);
        })
        .catch((error) => {
          this.setFlashBag("error", error.message);
          this.logger(error, "ERROR");
          return this.redirectToRoute("nodefony-user-update", {
            username: username
          });
        });
    default:
      throw new Error("Bad Method");
    }
  }

  /**
   *    @Method ({"GET", "POST", "DELETE"})
   *    @Route ("/delete/{username}", name="nodefony-user-delete")
   *
   */
  deleteAction(username) {
    this.checkAuthorisation(username);
    if (username) {
      return this.usersService.delete(username)
        .then((result) => {
          let message = `Delete User ${result.username} OK`;
          this.setFlashBag("info", message);
          if (this.getUser().username === username) {
            this.session.invalidate();
          }
          return this.redirectToRoute("nodefony-user");
        }).catch(e => {
          this.logger(e, "ERROR");
          this.setFlashBag("error", e.message);
          return this.redirectToRoute("nodefony-user");
        });
    }
    let error = new nodefony.Error(`User ${username} not found`, this.context);
    this.setFlashBag("error", error.message);
    this.logger(error, "ERROR");
    return this.redirectToRoute("nodefony-user");
  }

  /**
   *    @Method ({"GET", "PUT", "POST", "DELETE"})
   *    @Route ( "/{username}",name="nodefony-user",defaults={"username" = ""})
   *
   */
  userAction(username) {
    if (username) {
      switch (this.method) {
      case "PUT":
        return this.updateAction(username);
      case "DELETE":
        return this.deleteAction(username);
      case "GET":
        //const user = new User(this);
        return this.usersService.findOne(username)
          .then((result) => {
            if (result) {
              return this.render("users:users:readUsers.html.twig", {
                users: [result]
              });
            }
            return this.render("users:users:readUsers.html.twig");
          }).catch(e => {
            throw e;
          });
      }
    }
    switch (this.method) {
    case "POST":
      return this.createAction();
    default:
      return this.usersService.find()
        .then((result) => {
          return this.render("users:users:readUsers.html.twig", {
            users: result.rows
          });
        }).catch(e => {
          throw e;
        });
    }
  }

  checkAuthorisation(username, query) {
    let granted = this.is_granted("ROLE_ADMIN");
    if (username) {
      let user = this.getUser();
      if (!user) {
        throw new nodefony.authorizationError("Unauthorized", 401, this.context);
      }
      if (user.username !== username) {
        if (!granted) {
          throw new nodefony.authorizationError("Unauthorized Role", 401, this.context);
        }
      }
    }
    if (query && query.role && query.role.length) {
      if (query.role.indexOf("ROLE_ADMIN") >= 0 && (!granted)) {
        throw new nodefony.authorizationError("Unauthorized Role", 401, this.context);
      }
    }
    return true;
  }

}

module.exports = usersController;
