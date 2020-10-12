/**
 *  OVERRIDE BUNDLE REALTIME
 *
 *       see REALTIME BUNDLE config for more options
 *       monitoring service realtime
 */
module.exports = {
  services: {
    monitoring: {
      type: "tcp",
      port: 1318,
      domain: "0.0.0.0"
    }
  }
};