const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin({
      verbose: kernel.debug
    })
  ]
};