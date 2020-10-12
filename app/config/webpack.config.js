const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require('webpack-merge');
const precss = require('precss');
const autoprefixer = require('autoprefixer');


// Default context <bundle base directory>
//const context = path.resolve(__dirname, "..", "Resources", "public");
const public = path.resolve(__dirname, "..", "Resources", "public", "assets");
const package = require(path.resolve("package.json"));

const bundleConfig = require(path.resolve(__dirname, "config.js"));
const bundleName = package.name;
const publicPath = "/app/assets/";

let wpconfig = null;
let dev = true;
if (kernel.environment === "dev") {
  wpconfig = require("./webpack/webpack.dev.config.js");
} else {
  wpconfig = require("./webpack/webpack.prod.config.js");
  dev = false;
}

module.exports = merge(wpconfig, {
  //context: context,
  target: "web",
  entry: {
    app: ["./Resources/js/app.js"]
  },
  output: {
    path: public,
    publicPath: publicPath,
    filename: "./js/[name].js",
    library: "[name]",
    libraryExport: "default"
  },
  externals: {},
  resolve: {},
  module: {
    rules: [{
        // BABEL TRANSCODE
        test: new RegExp("\.es6$|\.js$"),
        exclude: new RegExp("node_modules"),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }]
      }, {
        test: require.resolve('jquery'),
        rules: [{
          loader: 'expose-loader',
          options: {
            exposes: [{
              globalName: '$',
              override: true,
                }, {
              globalName: 'jQuery',
              override: true,
            }]
          }
        }]
      }, {
        test: /jquery\..*\.js/,
        use: "imports-loader?$=jquery,jQuery=jquery,this=>window"
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
          //'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: 'resolve-url-loader',
            options: {}
          }, {
            loader: 'postcss-loader', // Run post css actions
            options: {
              postcssOptions: {
                plugins: [autoprefixer({}), precss({})]
              }
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/', // where the fonts will go
            publicPath: `${publicPath}/fonts/` // override the default path
          }
        }]
      }, {
        // IMAGES
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              publicPath: `${publicPath}/images/`,
              outputPath: "/images/"
            }
          }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      fallback: "style-loader",
      filename: "./css/[name].css",
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
  devServer: {
    inline: true,
    hot: false
  }
});
