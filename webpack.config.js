const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const SRC_DIR = path.join(__dirname, "/app");
const DEST_DIR = path.join(__dirname, "/public");

/**
 * Webpack Configuration
 * 
 * Supports different environments: local, development, production
 * Environment variables are loaded from .env.{NODE_ENV} files
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const nodeEnv = process.env.NODE_ENV || (isProduction ? "production" : "development");

  // Determine which .env file to use
  let envPath = path.join(__dirname, ".env");
  if (nodeEnv !== "production") {
    // Try environment-specific file first
    const specificEnvPath = path.join(__dirname, `.env.${nodeEnv}`);
    if (require("fs").existsSync(specificEnvPath)) {
      envPath = specificEnvPath;
    }
  }

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
    target: "web",
    devtool: isProduction ? "source-map" : "eval-source-map",
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
      // Load environment variables from .env file
      new Dotenv({
        path: envPath,
        systemvars: true,
        allowEmptyValues: true,
        safe: !isProduction, // Use .env.example in non-production
      }),
      // Define global variables for the frontend
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(nodeEnv),
        "process.env.GRAPHQL_ADDRESS": JSON.stringify(
          process.env.GRAPHQL_ADDRESS || "http://localhost:3000/graphql"
        ),
        "process.env.GOOGLE_CLIENT_ID": JSON.stringify(
          process.env.GOOGLE_CLIENT_ID || ""
        ),
      }),
    ],
    devServer: {
      contentBase: DEST_DIR,
      compress: true,
      historyApiFallback: true,
      port: 3000,
      hot: true,
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
  };
};
