const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.ts',
  output: {
    // publicPath: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Tetris',
      favicon: path.resolve(__dirname, 'public/images/favicon.png'),
    })
  ],
};
