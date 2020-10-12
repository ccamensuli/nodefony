import SwaggerUI from 'swagger-ui';
import {
  SwaggerUIBundle,
  SwaggerUIStandalonePreset
} from "swagger-ui-dist";

import "swagger-ui/dist/swagger-ui.css";
import "./swagger.css";

const configSwagger = process.env.SWAGGER;

class Swagger {
  constructor() {
    this.config = configSwagger;
    this.initialize();
    this.changeLogo();
  }

  changeLogo() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        // Section 01 - Set url link
        const logo = document.getElementsByClassName('link');
        logo[0].href = "/";
        logo[0].target = "_blank";
        // Section 02 - Set logo
        logo[0].children[0].alt = this.config.projectName;
        logo[0].children[0].src = this.config.logo;
      });
    });
  }

  initialize() {
    this.swagger = SwaggerUI({
      //url: "/api/users/documentation",
      urls: this.config.urls,
      "urls.primaryName": this.config.primaryName,
      dom_id: '#swagger',
      //defaultModelsExpandDepth: -1,
      deepLinking: true,
      presets: [
        SwaggerUI.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout",
      requestInterceptor: function (request) {
        //console.log('[Swagger] intercept try-it-out request');
        //request.headers.jwt = localstorage;
        return request;
      }
    });
  }
}

export default new Swagger();
