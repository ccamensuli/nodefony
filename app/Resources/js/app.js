/*
 *
 *	ENTRY POINT
 *  WEBPACK bundle app
 *  client side
 */
// javascript bootstrap library
import 'bootstrap';
// bootstrap scss framework
import '../scss/custom.scss';

/*
 *	Class Bundle App
 */
class App  {
  constructor() {
  }
}

/*
 * HMR
 */
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('Cannot apply HMR update.', err);
    }
  });
}
export default new App();
