const cpu = require('os').cpus().length;
const path = require("path");

const package = require(path.resolve("package.json"));
const name = package.name;
const logFile = path.resolve("tmp", `${name}.log`);
const script = process.argv[1] || "nodefony";

/**
 * Application configuration section
 * http://pm2.keymetrics.io/docs/usage/application-declaration/
 */
module.exports = {
  apps: [{
    name: name,
    script: script,
    args: "pm2",
    //node_args           : "--expose-gc",
    watch: false,
    exec_mode: "cluster",
    instances: cpu,
    max_memory_restart: "1024M",
    autorestart: true,
    max_restarts: 10,
    // Log in one file
    //log_file            : logFile,
    // Log in separate files
    out_file: path.resolve("tmp", `${name}.log`),
    error_file: path.resolve("tmp", `${name}.error`),
    // Merge clusters
    merge_logs: true,
    env: {
      "NODE_ENV": "production",
      "MODE_START": "PM2",
      "NODEFONY_DEBUG": false
    }
  }]
};
