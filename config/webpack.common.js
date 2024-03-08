const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'index.ts'),
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      { test: /\.(svg|png|jpg)$/, type: 'asset/resource' },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Tetris',
      favicon: path.resolve(__dirname, '..', 'public', 'favicon.png')
    })
  ]
}
