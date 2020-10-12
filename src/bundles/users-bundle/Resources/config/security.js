const path = require("path");

const cors = {
  "allow-origin": "*",
  "Access-Control": {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "nodefony_csrf, jwt, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Expose-Headers": "WWW-Authenticate ,X-Json, nodefony_csrf, jwt",
    "Access-Control-Max-Age": 10
  }
};

module.exports = {
  security: {
    /**
     *  FIREWALL  PROVIDER
     */
    providers: {
      anonymous: {
        anonymous: {
          provider: "anonymous"
        }
      },
      nodefony: {
        entity: {
          name: "user",
          property: "username"
        }
      }
    },
    encoders: {
      user: {
        algorithm: "bcrypt",
        saltRounds: 13
      }
    },

    /**
     *  FIREWALL  Authorization
     */
    access_control: [{
      path: /^\/nodefony/,
      roles: ["ROLE_MONITORING"],
      requires_channel: "https",
      /*allow_if: {
        roles: ["ROLE_ADMIN", "ROLE_USER"]
      }*/
    }],

    firewalls: {
      // SECURITY AREA  <passport-local>
      nodefony_area: {
        pattern: /^\/secure/,
        provider: "nodefony",
        form_login: {
          login_path: "/login/secure",
          check_path: "/login/check",
          default_target_path: "/users"
        },
        "passport-local": {
          usernameField: 'username',
          passwordField: 'passwd'
        },
        logout: "/logout",
        context: null,
        redirectHttps: true
      },
      // SECURITY AREA LOGIN API  <passport-local>
      login_api_area: {
        pattern: /^\/api\/jwt\/login/,
        provider: "nodefony",
        "passport-local": {
          usernameField: 'username',
          passwordField: 'passwd'
        },
        stateless: true,
        redirectHttps: true,
        crossDomain: cors
      },
      // SECURITY AREA  API  <passport-jwt>
      api_area: {
        pattern: /^\/api/,
        redirectHttps: true,
        stateless: true,
        "passport-jwt": {
          algorithms: "RS256",
          //secretOrKey:"Les sanglots longs Des violons De l’automne Blessent mon cœur D’une langueur Monotone."
          certificats: {
            private: path.resolve("config", "certificates", "ca", "private", "ca.key.pem"),
            public: path.resolve("config", "certificates", "ca", "public", "public.key.pem")
          },
          jwtFromRequest: { // fromCookie or fromHeader
            extractor: "fromHeader",
            params: ["jwt"]
          }
        },
        crossDomain: cors
      }
    }
  }
};
