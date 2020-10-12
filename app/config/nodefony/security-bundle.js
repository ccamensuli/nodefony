/**
 *  OVERRIDE SECURITY BUNDLE
 *
 *   HEADERS SECURITY
 *
 *    Content-Security-Policy
 *    Strict-Transport-Security
 *     ...
 *    Manage and Clean hsts in chrome
 *     chrome://net-internals/*hsts
 */
module.exports = {
  headers: {
    http: {
      //"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff"
    },
    https: {
      //"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff"
    }
  }
};