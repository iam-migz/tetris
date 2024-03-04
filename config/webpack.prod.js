const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.[contenthash].html',
      title: 'Tetris',
      favicon: path.resolve(__dirname, '..', 'public', 'favicon.png')
    })
  ]
})
