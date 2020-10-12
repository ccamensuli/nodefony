class loginController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
    this.startSession();
  }

  /**
   *    @Method ({"POST"})
   *    @Route (
   *      "/secure",
   *      name="secure-login"
   *    )
   */
  secureAction() {
    return this.loginCheckAction();
  }

  /**
   *    @Method ({"GET", "POST"})
   *    @Route (
   *      "/login/secure",
   *      name="login"
   *    )
   */
  loginAction() {
    let token = this.getToken();
    if (this.session && token) {
      return this.redirectToRoute("home");
    }
    return this.render("users:login:login.html.twig");
  }

  /**
   *    @Method ({"POST"})
   *    @Route (
   *      "/login/check",
   *      name="login-check"
   *    )
   */
  loginCheckAction(lastUrl) {
    //console.log(lastUrl)
    try {
      let token = this.getToken();
      if (token.user && token.user.enabled) {
        if (lastUrl) {
          return this.redirect(lastUrl);
        }
        return this.redirectToRoute("home");
      } else {
        this.session.invalidate();
        let error = null;
        if (token && !token.user.enabled) {
          error = new nodefony.securityError(
            `User ${token.user.username} Disabled `,
            401,
            this.context.security,
            this.context
          );
          this.logger(error, "ERROR");
          this.setFlashBag("error", error.message);
        } else {
          error = new nodefony.securityError(
            `No Auth Token`,
            401,
            this.context.security,
            this.context
          );
        }
        this.logger(error, "ERROR");
        this.setFlashBag("error", error.message);
        return this.redirectToRoute("login");
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   *    @Method ({ "GET"})
   *    @Route ("/logout", name="logout")
   */
  logoutAction() {
    return this.logout()
      .then(() => {
        return this.redirectToRoute("login");
      }).catch((e) => {
        this.logger(e, "ERROR");
        return this.redirectToRoute("login");
      });
  }

}

module.exports = loginController;
