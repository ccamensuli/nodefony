/**
 *	The class is a **`users` BUNDLE** .
 *	@module nodefony-starter
 *	@main nodefony-starter
 *	@class usersBundle
 *	@constructor
 *	@param {string} name
 *	@param {class} kernel
 *	@param {class} container
 *
 */
module.exports = class usersBundle extends nodefony.Bundle {

  constructor(name, kernel, container) {
    // Mother Class constructor
    super(name, kernel, container);
    // Load core bundle library
    switch (this.kernel.getOrm()) {
    case "sequelize":
      this.autoLoader.load(path.resolve(this.path, "src", "providers", "sequelize", "userProvider.js"));
      break;
    case 'mongoose':
      this.autoLoader.load(path.resolve(this.path, "src", "providers", "mongoose", "userProvider.js"));
      break;
    }
  }
};
