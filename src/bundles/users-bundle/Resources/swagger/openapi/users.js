/**
GET
La méthode GET demande une représentation de la ressource spécifiée. Les requêtes GET doivent uniquement être utilisées afin de récupérer des données.

HEAD
La méthode HEAD demande une réponse identique à une requête GET pour laquelle on aura omis le corps de la réponse (on a uniquement l'en-tête).

POST
La méthode POST est utilisée pour envoyer une entité vers la ressource indiquée. Cela  entraîne généralement un changement d'état ou des effets de bord sur le serveur.

PUT
La méthode PUT remplace toutes les représentations actuelles de la ressource visée par le contenu de la requête.

DELETE
La méthode DELETE supprime la ressource indiquée.

CONNECT
La méthode CONNECT établit un tunnel vers le serveur identifié par la ressource cible.

OPTIONS
La méthode OPTIONS est utilisée pour décrire les options de communications avec la ressource visée.

TRACE
La méthode TRACE réalise un message de test aller/retour en suivant le chemin de la ressource visée.

PATCH
La méthode PATCH est utilisée pour appliquer des modifications partielles à une ressource.

200 (OK)
201 (Created)
202 (Accepted)
204 (No Content)

301 (Moved Permanently)
302 (Found)
303 (See Other)
304 (Not Modified)
307 (Temporary Redirect)

400 (Bad Request)
401 (Unauthorized)
403 (Forbidden)
404 (Not Found)
405 (Method Not Allowed)
406 (Not Acceptable)
412 (Precondition Failed)
415 (Unsupported Media Type)
500 (Internal Server Error)
501 (Not Implemented)

**/

const openApi = {

  openapi: "3.0.2",
  security: [{
    jwtAuth: ""
  }],
  components: {
    securitySchemes: {
      jwtAuth: { // arbitrary name for the security scheme
        type: "apiKey",
        scheme: "bearer",
        in: "header", // can be "header", "query" or "cookie"
        name: "jwt" // name of the header, query parameter or cookie
      }
    },
    schemas: {

    },
    responses: {

    }
  },
  paths: {
    "/api/users/{username}": {
      get: {
        summary: "User Description",
        tags: ["users"],
        parameters: [{
          name: "username",
          description: "username",
          in: "path",
          required: true
        }],
        responses: {
          '200': {
            description: "User Description",
            content: {
              "application/json": {
                schema: {
                  allOf: [{
                    $ref: "#/components/schemas/users-api"
                }, {
                    type: "object",
                    properties: {
                      result: {
                        $ref: "#/components/schemas/user"
                      },
                    }
                }]
                }
              }
            }
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      }
    },
    "/api/users": {
      options: {
        summary: "Get OpenAPI (OAS 3.0) configuration",
        tags: ["users"],
        responses: {
          '200': {
            description: "OpenAPI (OAS 3.0) configuration",
            content: {
              "application/json": {}
            }
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      },
      get: {
        summary: "List all users",
        tags: ["users"],
        parameters: [{
          name: "limit",
          description: "limit",
          in: "query",
          required: false
        }, {
          name: "offset",
          description: "offset",
          in: "query",
          required: false
        }],
        responses: {
          '200': {
            description: "List or filter Users",
            content: {
              "application/json": {
                schema: {
                  allOf: [{
                    $ref: "#/components/schemas/users-api"
                  }, {
                    type: "object",
                    properties: {
                      result: {
                        type: "object",
                        properties: {
                          total: {
                            type: "integer"
                          },
                          rows: {
                            type: "array",
                            items: {
                              type: "object",
                              $ref: "#/components/schemas/user"
                            }
                          }
                        }
                      },
                    }
                  }]
                }
              }
            }
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      },
      post: {
        summary: "Create user",
        requestBody: {
          description: `Parameters **users** schema`,
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: '#/components/schemas/user'
              }
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: '#/components/schemas/user'
              }
            }
          },
        },
        tags: ["users"],
        responses: {
          '200': {
            description: "get headers request"
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      },
      head: {
        summary: "List headers Api",
        tags: ["users"],
        security: [{
          jwtAuth: ""
        }],
        responses: {
          '200': {
            description: "get headers request"
          },
          default: {
            $ref: "#/components/responses/default"
          }
        }
      }
    },
  },

  tags: [{
    name: "users",
    description: "Users operations"
  }]

};

module.exports = openApi;
