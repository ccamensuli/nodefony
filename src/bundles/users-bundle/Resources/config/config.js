/**
 *
 *
 *	nodefony-starter CONFIG BUNDLE  users-bundle
 *
 * ===============================================================================
 *
 *  Copyright © 2019/2019        admin | admin@nodefony.com
 *
 * ===============================================================================
 *
 *        GENERATE BY nodefony-starter BUILDER
 */

//const crypto = require('crypto');
const path = require('path');
const readFile = function (Path) {
  try {
    return fs.readFileSync(Path, {
      encoding: "utf8"
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
const randomSecret = function () {
  let sercretPath = path.resolve("config", "certificates", "ca", "private", "ca.key.pem");
  return readFile(sercretPath);
};

module.exports = {
  type: "sandbox",
  locale: "en_en",
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
  watch: false,

  /**
   *
   *	Insert here the bundle-specific configurations
   *
   *	You can also override config of another bundle
   *	with the name of the bundle
   *
   *	example : create an other database connector
   */
  csrfToken: {
    name: "nodefony_csrf",
    secret: randomSecret(),
    cookie: {
      signed: false,
      secure: true,
      sameSite: "strict",
      path: "/users",
      maxAge: 200
    }
  },
  jwt: {
    token: {
      expiresIn: 900
    },
    refreshToken: {
      expiresIn: 3600
    }
  },
  swagger: require(path.resolve(__dirname, "..", "swagger", "config.js")),

  graphiql: require(path.resolve(__dirname, "..", "graphiql", "config.js"))

};
