# Welcome to users-bundle

## Register and Configure users Bundle

### For a Register users-bundle in config framework
#### <code>/config/config.js</code>

```js
module.exports = {
  bundles: {
    "users-bundle": path.resolve("src", "bundles", "users-bundle")
  }
}
```

### Configure users-bundle

#### <code>./Resources/config/config.js</code>

```js
const randomSecret = function () {
  return crypto.randomBytes(48).toString('hex');
};

module.exports = {
  csrfToken: {
    name: "nodefony_csrf",
    secret: randomSecret(48),
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
  }
};
```

### Configure Firewall <code>./Resources/config/security.js</code>
```js
  // Cross Domain configuration
  const cors = {
    "allow-origin": "*",
    "Access-Control": {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Expose-Headers": "WWW-Authenticate",
      "Access-Control-Max-Age": 10
    }
  };

  module.exports = {
    // SECURITY AREA LOGIN API  <passport-local>
    login_api_area: {
      pattern: /^\/jwt\/login/,
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
```

## HTTP login :


## API REST

### Use API with axios :
```js
import axios from 'axios';

class LocalStorage {
  constructor() {
    axios.defaults.headers.common.jwt = this.token;
  }
  get token() {
    return localStorage.getItem('user-token') || null;
  }
  set token(value) {
    localStorage.setItem('user-token', value);
    axios.defaults.headers.common.jwt = value;
  }
  get refreshToken() {
    return localStorage.getItem('user-refresh-token') || null;
  }
  set refreshToken(value) {
    localStorage.setItem('user-refresh-token', value);
  }

  clearToken(refresh = false) {
    if (refresh) {
      localStorage.removeItem('user-refresh-token');
      delete this.refreshToken;
    }
    localStorage.removeItem('user-token');
    delete this.token;
  }
}

class Api extends LocalStorage {

  constructor() {
    try {
      super();
      axios.defaults.headers.common.Accept = 'application/json';
    } catch (e) {
      throw e;
    }
  }

  http(url, method, options) {
    // loadah defaultsDeep
    let opt = Object.assign({
      method: method || "get",
      url: url,
      data: null,
      headers: {}
    }, options);
    return axios(opt)
      .then(response => response.data)
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          if (error.response.statusText === "jwt expired") {
            return this.getToken()
              .then(() => {
                return this.http(url, method, opt);
              })
              .catch((e) => {
                throw e;
              });
          }
        }
        throw error;
      });
  }
  get(url, data) {
    return this.http(url, "get", data);
  }
  post(url, data) {
    return this.http(url, "post", data);
  }
  put(url, data) {
    return this.http(url, "put", data);
  }
  delete(url, data) {
    return this.http(url, "delete", data);
  }

  login(url = "/jwt/login", username = null, passwd = null) {
    return axios({
        method: "post",
        url: url,
        data: {
          username: username,
          passwd: passwd
        }
      })
      .then(response => {
        // Here set the header of your ajax library to the token value.
        this.token = response.data.result.token;
        this.refreshToken = response.data.result.refreshToken;
        return response;
      })
      .catch((error) => {
        this.clearToken(true);
        throw error;
      });
  }
  logout(url = "/jwt/logout", options = {}) {
    return this.get(url, options)
      .then(response => {
        this.clearToken(true);
        return response;
      })
      .catch((error) => {
        this.clearToken(true);
        throw error;
      });
  }
  getToken() {
    return axios({
        method: "post",
        url: "/jwt/token",
        data: {
          refreshToken: this.refreshToken
        }
      })
      .then(response => {
        this.token = response.data.result.token;
        return response;
      })
      .catch((error) => {
        this.clearToken(true);
        throw error;
      });
  }
}
export default new Api();
```

### Use Api Users with curl :

```bash
# login user with jwt  get token and refreshToken
curl -k -X POST --data "username=admin" --data "passwd=admin" https://localhost:5152/jwt/login
    # {
    #   api: "users"
    #   version: "1.0.0"
    #   code: 200
    #   error: null
    #   message: "OK"
    #   method: "POST"
    #   result:
    #     config: {name: "users", version: "1.0.0", debug: false, accept: Array(1), nodefony: {…}, …}
    #     decodedToken: {data: {…}, iat: 1575494865, exp: 1575495765}
    #     refreshToken: "z6Y1KZD3NR1wEjaKaEXqhugdkpZy...."
    #     token:"XHl4uo05_gKsBPCiDpfADYCFSoPuySfCaLzOmzCKaky...."
    #   scheme: "https"
    #   severity: "INFO"
    #   url: "https://localhost:5152/jwt/login"
    # }

# use api with valid token
curl -k -X GET  -H "jwt: token"  https://localhost:5152/api/users
      # {
      #   api: "users"
      #   version: "1.0.0"
      #   code: 200
      #   message: "OK"
      #   method: "GET"
      #   result:
      #     rows: Array(5)
      #       0: {roles: Array(1), username: "anonymous", 2fa: false, 2fa-token: null, …}
      #       1: {roles: Array(1), username: "admin", 2fa: false, 2fa-token: null, …}
      #       2: {roles: Array(2), username: "1000", 2fa: false, 2fa-token: null, …}
      #       3: {roles: Array(1), username: "2000", 2fa: false, 2fa-token: null, …}
      #       4: {roles: Array(1), username: "3000", 2fa: false, 2fa-token: null, …}
      #     total: 5
      #   scheme: "https"
      #   severity: "INFO"
      #   url: "https://localhost:5152/api/users"
      # }
# Refresh Token
curl -k -X POST  --data "refreshToken=refreshToken" https://localhost:5152/jwt/token
```

## Cli Commands

```bash
$ nodefony -h

users :                                                                                               
 users:show [user]                           nodefony users:show admin                                                                                               
 users:find [--json] username                nodefony --json users:find admin                                                                                        
 users:findAll [--json]                      nodefony --json users:findAll  

$ nodefony users:show

   _   _   ___    ___   _ __   ___
  | | | | / __|  / _ \ | '__| / __|
  | |_| | \__ \ |  __/ | |    \__ \
   \__,_| |___/  \___| |_|    |___/

Thu Dec 05 2019 10:45:22 INFO COMMAND : users:show
Thu Dec 05 2019 10:45:22 INFO nodefony : START TABLE : 🎬
┌───────────┬───────────────┬───────────┬────────────────────────────┬─────────────────┬─────────────────────────┬─────────┐
│ username  │ First Name    │ Last Name │ Email address              │ Two Factor Auth │ Credentials Non Expired │ Enabled │
├───────────┼───────────────┼───────────┼────────────────────────────┼─────────────────┼─────────────────────────┼─────────┤
│ anonymous │ anonymous     │ anonymous │ anonymous@nodefony.com     │ false           │ true                    │ true    │
├───────────┼───────────────┼───────────┼────────────────────────────┼─────────────────┼─────────────────────────┼─────────┤
│ admin     │ administrator │ nodefony  │ administrator@nodefony.com │ false           │ true                    │ true    │
├───────────┼───────────────┼───────────┼────────────────────────────┼─────────────────┼─────────────────────────┼─────────┤
│ 1000      │ Michael       │ Corleone  │ michael@nodefony.com       │ false           │ true                    │ true    │
├───────────┼───────────────┼───────────┼────────────────────────────┼─────────────────┼─────────────────────────┼─────────┤
│ 2000      │ Vito          │ Corleone  │ vito@nodefony.com          │ false           │ true                    │ true    │
├───────────┼───────────────┼───────────┼────────────────────────────┼─────────────────┼─────────────────────────┼─────────┤
│ 3000      │ Connie        │ Corleone  │ connie@nodefony.com        │ false           │ true                    │ true    │
└───────────┴───────────────┴───────────┴────────────────────────────┴─────────────────┴─────────────────────────┴─────────┘
Thu Dec 05 2019 10:45:22 INFO nodefony : END TABLE : 🏁

```

## Cli TESTS

``` bash

$ nodefony unitest:list:all

                 _   _                  _       _   _         _   
 _   _   _ __   (_) | |_    ___   ___  | |_    | | (_)  ___  | |_
| | | | | '_ \  | | | __|  / _ \ / __| | __|   | | | | / __| | __|
| |_| | | | | | | | | |_  |  __/ \__ \ | |_    | | | | \__ \ | |_
 \__,_| |_| |_| |_|  \__|  \___| |___/  \__|   |_| |_| |___/  \__|


Thu Dec 05 2019 10:55:21 INFO COMMAND unitest TASK list : ★★★ BUNDLE : users ★★★

Thu Dec 05 2019 10:55:21 INFO COMMAND unitest TASK list :        ‣ usersTest.js


$ nodefony unitest:launch:bundle users

                            _   _                  _       _                                  _     
            _   _   _ __   (_) | |_    ___   ___  | |_    | |   __ _   _   _   _ __     ___  | |__  
           | | | | | '_ \  | | | __|  / _ \ / __| | __|   | |  / _` | | | | | | '_ \   / __| | '_ \
           | |_| | | | | | | | | |_  |  __/ \__ \ | |_    | | | (_| | | |_| | | | | | | (__  | | | |
            \__,_| |_| |_| |_|  \__|  \___| |___/  \__|   |_|  \__,_|  \__,_| |_| |_|  \___| |_| |_|


Thu Dec 05 2019 10:58:45 INFO COMMAND : unitest:launch:bundle users

✓ BUNDLE users API LOGIN LOGIN JWT: 658ms
✓ BUNDLE users API LOGIN BAD PASSWD LOGIN  JWT : 559ms
✓ BUNDLE users API LOGIN BAD NAME LOGIN JWT : 18ms
✓ BUNDLE users API LOGIN BAD LOGIN NO credentials : 10ms

4 passing (1s)

Thu Dec 05 2019 10:58:47 INFO KERNEL CONSOLE  : NODEFONY Kernel Life Cycle Terminate CODE : 0

```

## <a name="authors"></a>Authors

- Camensuli Christophe  ccamensuli@gmail.com

##  <a name="license"></a>License
