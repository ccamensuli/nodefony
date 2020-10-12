/**
*
*
*	nodefony-starter CONFIG BUNDLE  vue-bundle
*
* ===============================================================================
*
*  Copyright © 2020/2020        admin | admin@nodefony.com
*
* ===============================================================================
*
*        GENERATE BY nodefony-starter BUILDER
*/

module.exports = {
  type        : "vue",
  locale      : "en_en",

  /**
   *    WATCHERS
   *
   *  watchers Listen to changes, deletion, renaming of files and directories
   *  of different components
   *
   *  For watch all components
   *      watch:                    true
   *  or
   *      watch:{
   *        controller:             true,
   *        config:                 true,        // only routing and services
   *        views:                  true,
   *        translations:           true,
   *        webpack:                true
   *      }
   *
   */
  watch: true,

  /**
   * DEV SERVER
   */
  devServer: {
    hot: true
  }

  /**
   *
   *	Insert here the bundle-specific configurations
   *
   *	You can also override config of another bundle
   *	with the name of the bundle
   *
   *	example : create an other database connector
   */

};
