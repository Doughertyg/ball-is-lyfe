const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

var SRC_DIR = path.join(__dirname, "/app");
var DEST_DIR = path.join(__dirname, "/public");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    optimization: {
      minimize: isProduction,
      minimizer: isProduction ? [new TerserPlugin({
        parallel: false,
      })] : [],
    },
    entry: `${SRC_DIR}/index.jsx`,
    output: {
      filename: "bundle.js",
      path: DEST_DIR,
      publicPath: "/",
    },
    target: "web", // Make sure Webpack knows this is a browser build
    devtool: "eval-source-map",
    module: {
      rules: [
        {
          test: /\.jsx?/,
          include: SRC_DIR,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "resolve-url-loader", "sass-loader"],
        },
        {
          test: /\.(gif|jpg|png)$/,
          use: ["file-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"],
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.node$/,
          use: "null-loader",
        },
      ],
    },
    plugins: [
      ...(!isProduction ? [new Dotenv({
        path: "./.env",
        systemvars: true,
        allowEmptyValues: true,
      })] : []),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(argv.mode),
        "process.env.GRAPHQL_ADDRESS": JSON.stringify(process.env.GRAPHQL_ADDRESS),
        "process.env.GOOGLE_CLIENT_ID": JSON.stringify(process.env.GOOGLE_CLIENT_ID),
      }),
    ],
    devServer: {
      contentBase: DEST_DIR,
      compress: true,
      historyApiFallback: true,
      port: 3000,
    },
    node: {
      __dirname: false,
      __filename: false,
      fs: "empty",
      net: "empty",
      tls: "empty",
      module: "empty",
      inspector: "empty",
      child_process: "empty",
    },
  }
};
