/**
 *	The class is a **`vue` BUNDLE** .
 *	@module nodefony-starter
 *	@main nodefony-starter
 *	@class vueBundle
 *	@constructor
 *	@param {string} name
 *	@param {class} kernel
 *	@param {class} container
 *
 */
 
 class vueBundle  extends nodefony.Bundle {

  constructor (name, kernel, container){
    // Mother Class constructor
    super( name, kernel, container );

  // Load core bundle library
  //this.autoLoader.loadDirectory( path.resolve( this.path, "src" ) );

 /*
  *	If you want kernel wait vue event <<onReady>>
  *
  *      this.waitBundleReady = true ;
  */
  }
}

module.exports = vueBundle ;
