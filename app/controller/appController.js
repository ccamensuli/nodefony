
/**
 *	@class appController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class appController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

/**
 *    @Route ("/",
 *      name="home")
 */
  indexAction() {
    return this.render("app::index.html.twig", {
      name: this.kernel.projectName,
			description: this.kernel.package.description    });

  }
}

module.exports = appController;
