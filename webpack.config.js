var path = require("path");
var SRC_DIR = path.join(__dirname, "/app");
var DEST_DIR = path.join(__dirname, "/public");

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: "bundle.js",
    path: DEST_DIR,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
	use: {
	  loader: 'babel-loader',
	  options: {
	    presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
	    ]
	  }
	}
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
	  'resolve-url-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(gif|jpg|png)$/,
        use: [
	  "file-loader",
	],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  devServer: {
    contentBase: DEST_DIR,
    compress: true,
    historyApiFallback: true,
    port: 3000,
  },
};
