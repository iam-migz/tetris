const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: '../dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
    })
  ]
})
