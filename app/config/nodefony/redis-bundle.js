/**
 *    OVERRIDE REDIS BUNDLE SETTINGS
 *
 *   All Options :                https://github.com/NodeRedis/node_redis
 *
 *   Add clients connections
 *   connections :{
 *     data :{
 *       name: "data"
 *      },
 *     publish :{
 *       name: "publish"
 *      },
 *     subscribe :{
 *       name: "subscribe"
 *      }
 *    }
 */
module.exports = {
  redis: {
    debug: true,
    globalOptions: {
      host: "localhost",
      port: 6379,
      family: "IPv4",
      disable_resubscribing: false,
      tls: null,
      no_ready_check: false,
      socket_keepalive: false,
      return_buffers: false,
      retry_unfulfilled_commands: true
    },
    connections: {
      main: {
        name: "main"
      }
    }
  }
};