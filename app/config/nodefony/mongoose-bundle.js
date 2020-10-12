/**
 *   OVERRIDE ORM BUNDLE MONGOOSE
 *
 *       @see MONGO BUNDLE config for more options
 *       @more options https://mongoosejs.com/docs/connections.html
 *
 *       By default nodefony create connector name nodefony
 *       for manage Sessions / Users
 */
module.exports = {
  debug: false,
  connectors: {
    nodefony: {
      host: "localhost",
      port: 27017,
      dbname: "nodefony",
      settings: {
        user: "",
        pass: "",
        authSource: "admin",
        reconnectTries: 100,
        reconnectInterval: 5000,
        autoReconnect: true,
        poolSize: 5
      }
    }
  }
};