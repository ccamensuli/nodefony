const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require('webpack-merge');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

// Default context <bundle base directory>
//const context = path.resolve(__dirname, "..", "public");
const public = path.resolve(__dirname, "..", "public", "assets");
const package = require(path.resolve("package.json"));

const bundleConfig = require(path.resolve(__dirname, "config.js"));
const bundleName = package.name;
const publicPath = `/${bundleName}-bundle/assets/`;

let config = null;
let dev = true;
if (kernel.environment === "dev") {
  config = require("./webpack/webpack.dev.config.js");
} else {
  config = require("./webpack/webpack.prod.config.js");
  dev = false;
}


module.exports = merge(config, {
  //context: context,
  target: "web",
  entry: {
    users: ["./Resources/js/users.js"],
    swagger: ["./Resources/swagger/swagger.js"],
    graphiql: ["./Resources/graphiql/graphiql.jsx"]
  },
  output: {
    path: public,
    publicPath: publicPath,
    filename: "./js/[name].js",
    library: "[name]",
    libraryExport: "default"
  },
  externals: {},
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.mjs'],
    fallback: { "path": false }
  },
  module: {
    rules: [{
        // BABEL TRANSCODE
        test: /\.(jsx|mjs|js|es6)$/,
        exclude: new RegExp("node_modules"),
        use: [{
          loader: 'babel-loader',
          options: {
            //presets: ['@babel/preset-env', '@babel/preset-react']
            presets: [
                 ['@babel/preset-env', {
                modules: false
              }],
                 '@babel/preset-react',
               ],
          }
        }]
      }, {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
        include: /node_modules/,
      }, {
        test: require.resolve('jquery'),
        rules: [{
          loader: 'expose-loader',
          options: {
            //expose: ['$', 'jQuery'],
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
            publicPath: `${publicPath}fonts/` // override the default path
          }
        }]
      }, {
        test: /\.svg$/,
        use: [{
          loader: 'svg-inline-loader'
        }],
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
      filename: "./css/[name].css",
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      'process.env.GRAPHIQL': JSON.stringify(bundleConfig.graphiql),
      'process.env.SWAGGER': JSON.stringify(bundleConfig.swagger)
    })
  ],
  devServer: {
    inline: true,
    hot: false
  }
});
