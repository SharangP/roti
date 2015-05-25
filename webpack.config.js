module.exports = {
  entry: __dirname + "/static/js/index.js",
  devtool: "eval-source-map",

  entry: {
    order: __dirname + "/static/js/pages/order.js"
  },
  output: {
    path: __dirname + "/static/assets",
    pathinfo: true,
    filename: "[name].js"
  },

  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: "babel-loader?optional=runtime&loose"
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
        loader: "file"
      }
    ]
  },

  resolve: {
    modulesDirectories: [ __dirname + "/static/js", "node_modules" ]
  }
};
