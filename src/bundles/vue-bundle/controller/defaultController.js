
/**
 *	@class defaultController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 *  @Route ("/vue")
 */
class defaultController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

/**
 *    @Route ("*",
 *      name="route-vue-bundle-vue")
 */
  indexAction() {
    return this.render("vue-bundle::index.html.twig", {
			name: this.bundle.name,
			description: this.bundle.package.description    });

  }
}

module.exports = defaultController;
