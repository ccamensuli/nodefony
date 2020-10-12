
/**
 *	@class defaultController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 *  @Route ("/react")
 */
class defaultController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

/**
 *    @Route ("*",
 *      name="route-react-bundle-react")
 */
  indexAction() {
      return this.renderHtmlFile(path.resolve(this.bundle.publicPath, "dist","index.html"));
  }
}

module.exports = defaultController;
