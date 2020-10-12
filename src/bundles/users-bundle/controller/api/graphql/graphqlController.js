/**
 *    @Route ("/api/graphql/users")
 *
 */
const userSchema = require("./userSchema.js");

class graphqlController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // service entity
    this.usersService = this.get("users");
    // graphql api
    this.api = new nodefony.api.Graphql({
      name: "users-grahql-api",
      version: this.bundle.version,
      description: "Nodefony Users graphql Api",
      basePath: "/api/graphql/users",
      schema: userSchema
    }, this.context);
  }

  /**
   *    @Method ({"GET", "POST","OPTIONS"})
   *    @Route ( "*",name="api-user-graphql")
   *    @Firewall ({bypass:true})
   */
  graphqlAction() {
    try {
      return this.api.query(this.query.query, this.query.variables, this.query.operationName)
        .then((data) => {
          return this.api.render(data);
        }).catch((e) => {
          this.api.logger(e, "ERROR");
          return this.api.renderError(e, 400);
        });
    } catch (e) {
      throw e;
    }
  }

  async user(field) {
    return await this.usersService.findOne(field.username);
  }

  async users() {
    let res = await this.usersService.find();
    return res.rows   ;
  }

  async addUser(field) {
    let res = await this.usersService.create(field);
    return res;
  }

}

module.exports = graphqlController;
