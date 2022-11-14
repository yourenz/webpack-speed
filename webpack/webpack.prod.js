const { merge } = require("webpack-merge");
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].chunk.css",
  })
  ],
  optimization: {
    minimize: true,
    runtimeChunk: true,
    moduleIds: "deterministic",
    // chunkIds:'named',
    minimizer: [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
      }),
      new ESBuildMinifyPlugin({
        legalComments: 'none'
      })
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10, 
          enforce: true,
        },
      },
    },
  },
});