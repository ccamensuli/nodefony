/**
 *  OVERRIDE BUNDLE HTTP SETTINGS
 *
 *       see HTTP BUNDLE config for more options
 *
 *       query string parser
 *       form-data multipart parser
 *       upload
 *       statics files
 *       session
 *       http server
 *       https server
 *       upload
 *       websocket server
 *       websocket secure server
 *       sockjs dev server ( webpack dev server like WDS)
 *
 */
module.exports = {
  // For more options request parser formidable @see : https://github.com/felixge/node-formidable
  request: {
    uploadDir: "/tmp", // temporing file upload system
    maxFileSize: 2097152, // In Bytes
    maxFieldsSize: 2097152, // 2MB
    maxFields: 1000, // 0 for unlimited
  },
  //For more options queryString parser QS @see : https://github.com/ljharb/qs
  queryString: {
    parameterLimit: 1000,
    delimiter: "&"
  },
  //Server @see : https://nodejs.org/dist/latest-v8.x/docs/api/http.html*http_class_http_server
  http: {
    responseTimeout: 40000,
    headers: {
      "Cache-Control": "private, no-store, max-age=0, no-cache, must-revalidate"
    }
  },
  https: {
    responseTimeout: 40000,
    headers: {
      "Cache-Control": "private, no-store, max-age=0, no-cache, must-revalidate"
    }
  },
  http2: {
    enablePush: true
  },
  websocket: {
    keepaliveInterval: 20000,
    keepaliveGracePeriod: 10000,
    closeTimeout: 5000
  },
  websocketSecure: {
    keepaliveInterval: 20000,
    keepaliveGracePeriod: 10000,
    closeTimeout: 5000
  },
  statics: {
    defaultOptions: {
      cacheControl: true,
      maxAge: 0
    },
    web: {
      path: path.resolve("web"),
      options: {
        maxAge: 0 //30*24*60*60*1000
      }
    }
  },
  sockjs: {
    domain: kernel.settings.system.domain,
    port: kernel.settings.system.httpsPort
  },
  session: {
    start: false, // false || true || Session Context Name (waf)
    name: "nodefony",
    handler: "orm", // files | orm | memcached
    //save_path: "./tmp/sessions", // for session.storage.files only
    use_strict_mode: true,
    gc_probability: 1,
    gc_divisor: 100,
    gc_maxlifetime: 1440,
    use_cookies: true,
    use_only_cookies: true,
    referer_check: false,
    cookie: {
      maxAge: 0, // like cookie_lifetime php  => secondes or ms style ('1d', "1h")
      secure: false, // Set true for https site only see https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie
      httpOnly: true
    },
    memcached: {
      servers: {
        nodefony: {
          location: "127.0.0.1",
          port: 11211,
          weight: 1
        }
      }
    }
  }
};
