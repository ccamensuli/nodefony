/**
 * OVERRIDE ELASTIC BUNDLE SETTINGS
 *   elasticsearch
 *
 *	 options  :  https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-configuration.html
 *
 */
module.exports = {
  elasticsearch: {
    globalOptions: {
      ssl: {
        //key : path.resolve("config","certificates","server","privkey.pem"),
        //cert : path.resolve("config","certificates","server","cert.pem"),
        //ca : path.resolve("config","certificates","ca","nodefony-root-ca.crt.pem")
      }
    },
    connections: {
      main: {
        name: "main",
        nodes: ["http://localhost:9200"],
        log: {
          request: false,
          response: false,
          sniff: true,
          resurrect: true
        },
        maxRetries: 10,
        //resurrectStrategy: "optimistic",
        //sniffOnStart: true,
        //sniffInterval: 5000,
        //sniffOnConnectionFault: true,
        pingTimeout: 5000,
        requestTimeout: 5000
      }
    }
  }
};