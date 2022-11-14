const { merge } = require("webpack-merge");
const { resolveApp } = require("./paths");
const common = require("./webpack.common");


const config = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: {
      directory: resolveApp("dist"),
    },
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    compress: true,
    port: 8080,
  },
  plugins: [],
});

module.exports = config