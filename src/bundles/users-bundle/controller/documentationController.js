/**
 *    @Route ("/users/documentation")
 */
class documentationController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

  /**
   *    @Method ({"GET"})
   *    @Route (
   *      "",
   *      name="users-doc"
   *    )
   */
  indexAction(){
    let readme = path.resolve(this.bundle.path,"README.md") ;
    return this.render("users:documentation:index.html.twig", {
      title: "README",
      readme:this.htmlMdParser(new nodefony.fileClass(readme).content())
    });
  }

  /**
   *    @Method ({"GET"})
   *    @Route (
   *      "/slides",
   *      name="user-doc-slides"
   *    )
   */
  slidesAction(){
    return this.render("users:documentation:slides.html.twig", {
      title: "Presentation"
    });
  }

  /**
   *    @Method ({"GET"})
   *    @Route (
   *      "/openapi",
   *      name="openapi-doc"
   *    )
   */
  swaggerAction() {
    return this.render("users:swagger:index.html.twig", {
      title: "user openapi"
    });
  }

  /**
   *    @Method ({"GET"})
   *    @Route (
   *      "/graphql",
   *      name="graphql-doc"
   *    )
   */
  graphiqlAction() {
    return this.render("users:graphiql:index.html.twig", {
      title: "user graphiql"
    });
  }

}

module.exports = documentationController;
