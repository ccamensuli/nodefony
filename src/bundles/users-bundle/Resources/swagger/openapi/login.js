const openapi = {
  openapi: "3.0.2",
  components: {
    securitySchemes: {
      jwtAuth: { // arbitrary name for the security scheme
        type: "apiKey",
        in: "header", // can be "header", "query" or "cookie"
        name: "jwt" // name of the header, query parameter or cookie
      }
    },
    schemas: {
      jwt: {
        type: "object",
        properties: {
          token: {
            type: "string"
          },
          refreshToken: {
            type: "string"
          },
          decodedToken: {
            type: "object"
          }
        },
        example: `{
"decodedToken": {
      "data": {
        "name": "userPassword",
        "roles": [
          {
            "role": "ROLE_ADMIN"
          }
        ],
        "user": {
          "username": "admin",
          "name": "administrator",
          "surname": "nodefony",
          "roles": [
            "ROLE_ADMIN"
          ],
          "lang": "en_en",
          "enabled": true,
          "accountNonExpired": true,
          "credentialsNonExpired": true,
          "accountNonLocked": true
        },
        "authenticated": true,
        "factory": "local",
        "provider": "nodefony"
      },
      "iat": 1576074663,
      "exp": 1576075563
    },
"token": ".....",
"refreshToken":"......"
  }
        `
      }
    },
    responses: {

    }
  },
  paths: {
    "/api/jwt": {
      options: {
        summary: "Get OpenAPI (OAS 3.0) configuration",
        tags: ["JSON WEB TOKEN"],
        responses: {
          '200': {
            description: "A paged array of users"
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      },
    },
    "/api/jwt/login": {
      post: {
        summary: "Authnticate user with credentials",
        tags: ["JSON WEB TOKEN"],
        parameters: [{
          name: "username",
          description: "User name",
          in: "query",
          required: true
        }, {
          name: "passwd",
          description: "User password",
          in: "query",
          required: true
        }],
        responses: {
          '200': {
            description: "get Authentication tokens",
            content: {
              "application/json": {
                schema: {
                  allOf: [{
                    $ref: "#/components/schemas/login-api"
                  }, {
                    type: "object",
                    properties: {
                      result: {
                        $ref: "#/components/schemas/jwt"
                      },
                    }
                  }]
                },
                example: `{
  "api": "login-api",
  "version": "1.0.0",
  "result": {
    "decodedToken": {
      "data": {
        "name": "userPassword",
        "roles": [
          {
            "role": "ROLE_ADMIN"
          }
        ],
        "user": {
          "username": "admin",
          "name": "administrator",
          "surname": "nodefony",
          "roles": [
            "ROLE_ADMIN"
          ],
          "lang": "en_en",
          "enabled": true,
          "accountNonExpired": true,
          "credentialsNonExpired": true,
          "accountNonLocked": true
        },
        "authenticated": true,
        "factory": "local",
        "provider": "nodefony"
      },
      "iat": 1576074663,
      "exp": 1576075563
    },
    "token": "....",
    "refreshToken":"...."
  },
  "message": "OK",
  "messageId": null,
  "error": null,
  "errorCode": null,
  "errorType": null,
  "debug": false,
  "url": "https://0.0.0.0:5152/api/jwt/login?username=admin&passwd=admin",
  "method": "POST",
  "scheme": "https",
  "severity": "INFO",
  "code": 200
}
                `
              }
            }
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      }
    },
    "/api/jwt/token": {
      post: {
        summary: "Regenerate token with refreshToken",
        tags: ["JSON WEB TOKEN"],
        parameters: [{
          name: "refreshToken",
          description: "Authentication refreshToken",
          in: "header",
          //required: true
        }],
        requestBody: {
          description: ``,
          //required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                properties: {
                  refreshToken: {
                    type: "string"
                  }
                },
                required: ["refreshToken"]
              }
            }
          },
        },
        responses: {
          '200': {
            description: "Regenerated Token"
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      }
    },
    "/api/jwt/logout": {
      post: {
        summary: "logout user",
        tags: ["JSON WEB TOKEN"],
        parameters: [{
          name: "refreshToken",
          description: "Authentication refreshToken",
          in: "query",
          required: true
        }],
        responses: {
          '200': {
            description: "logout user"
          },
          default: {
            $ref: "#/components/responses/default"
          }
        },
        security: [{
          jwtAuth: ""
        }],
      }
    },
  },
  tags: [{
    name: "JSON WEB TOKEN",
    description: "**JWT Authentication and refresh**"
  }]
};

module.exports = openapi;
