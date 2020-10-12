/**
 *	The class is a **`react` BUNDLE** .
 *	@module nodefony-starter
 *	@main nodefony-starter
 *	@class reactBundle
 *	@constructor
 *	@param {string} name
 *	@param {class} kernel
 *	@param {class} container
 *
 */
 
 class reactBundle  extends nodefony.Bundle {

  constructor (name, kernel, container){
    // Mother Class constructor
    super( name, kernel, container );

  // Load core bundle library
  //this.autoLoader.loadDirectory( path.resolve( this.path, "src" ) );

 /*
  *	If you want kernel wait react event <<onReady>>
  *
  *      this.waitBundleReady = true ;
  */
  }
}

module.exports = reactBundle ;
