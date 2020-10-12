/**
 *  NODEFONY FRAMEWORK
 *
 *       KERNEL CONFIG
 *
 *   Domain listen : Nodefony can listen only one domain ( no vhost )
 *     Example :
 *      domain :  0.0.0.0      // for all interfaces
 *      domain :  [::1]        // for IPV6 only
 *      domain :  192.168.1.1  // IPV4
 *      domain :  mydomain.com // DNS
 *
 *   Domain Alias : string only "<<regexp>>" use domainCheck : true
 *     Example :
 *      domainAlias:[
 *        "^127.0.0.1$",
 *        "^localhost$",
 *        ".*\\.nodefony-starter\\.com",
 *        "^nodefony-starter\\.eu$",
 *        "^.*\\.nodefony-starter\\.eu$"
 *      ]
 */
const path = require("path");
let certificats = {
  options: {
    rejectUnauthorized: true
  }
};
let CDN = null;
let statics = true;
let monitoring = true;
let documentation = true;
let unitTest = true;
let domainCheck = false;
if (process.env && process.env.NODE_ENV === "production") {
  certificats.key = path.resolve("config", "certificates", "server", "privkey.pem");
  certificats.cert = path.resolve("config", "certificates", "server", "fullchain.pem");
  certificats.ca = path.resolve("config", "certificates", "ca", "nodefony-starter-root-ca.crt.pem");
  CDN = null;
  statics = true;
  documentation = false;
  monitoring = true;
  unitTest = false;
  domainCheck = true;
} else {
  certificats.key = path.resolve("config", "certificates", "server", "privkey.pem");
  certificats.cert = path.resolve("config", "certificates", "server", "fullchain.pem");
  certificats.ca = path.resolve("config", "certificates", "ca", "nodefony-starter-root-ca.crt.pem");
}

module.exports = {
  system: {
    domain: "0.0.0.0",
    domainAlias: [
      "^127.0.0.1$",
      "^localhost$"
    ],
    httpPort: 5151,
    httpsPort: 5152,
    domainCheck: domainCheck,
    locale: "en_en",

    /**
     * BUNDLES CORE
     */
    security: true,
    realtime: true,
    monitoring: monitoring,
    mail: true,
    documentation: documentation,
    unitTest: unitTest,
    redis: false,
    mongo: false,
    elastic: false,

    /**
     * SERVERS
     */
    servers: {
      statics: statics,
      protocol: "1.1", //  2.0 || 1.1
      http: true,
      https: true,
      ws: true,
      wss: true,
      certificats: certificats
    },

    /**
     * DEV SERVER
     */
    devServer: {
      inline: true,
      hot: false,
      hotOnly: false,
      overlay: true,
      logLevel: "info", // none, error, warning or info
      progress: false,
      protocol: "https",
      websocket: true
    },

    /**
     *  BUNDLES LOCAL REGISTRATION
     *    Examples :
     *       bundles:{
     *         "hello-bundle" : "file:src/bundles/hello-bundle",
     *         "hello-bundle" : path.resolve("src", "bundles", "hello-bundle")
     *         "hello-bundle" : path.resolve(__dirname, "..", "src", "bundles", "hello-bundle"),
     *       }
     */
    bundles: {
      "users-bundle": path.resolve("src", "bundles", "users-bundle"),
      //"vue-bundle": path.resolve("src", "bundles", "vue-bundle"),
      //"react-bundle": path.resolve("src", "bundles", "react-bundle")
    },
    /**
     * SYSLOG NODEFONY
     */
    log: {
      active: true
    }
  },

  /**
   *       ASSETS CDN
   *
   *       You set cdn with string
   *       CDN :    "cdn.nodefony-starter.com",
   *       or
   *       CDN:
   *          global: "cdn.nodefony-starter.com",
   *       or
   *       CDN:{
   *         stylesheet:[
   *           "cdn.nodefony-starter.com"
   *         ],
   *         javascript:[
   *           "cdn.nodefony-starter.com"
   *         ],
   *         image:[
   *           "cdn.nodefony-starter.com",
   *           "cdn.nodefony-starter.fr"
   *         ],
   *         font:[
   *           "cdn.nodefony-starter.com"
   *         ]
   *      },
   */
  CDN: CDN,

  /**
   *  ENGINE TEMPLATE
   *
   *       TWIG
   *       https://github.com/justjohn/twig.js
   *
   */
  templating: "twig",

  /**
   * ENGINE ORM
   *       sequelize || mongoose
   *   orm : mongoose
   */
  orm: "sequelize",

  /**
   * NODE.JS PACKAGE MANAGER
   *
   *       npm
   *       yarn
   */
  packageManager: "npm"

};
