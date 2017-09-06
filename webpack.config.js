const path = require("path");

module.exports = (env = "react") => ({
  entry: "./src/",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "Drift.js",
    library: "calliope",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
});
