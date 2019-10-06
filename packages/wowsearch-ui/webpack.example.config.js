/**
 * @file webpack.config.js
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = merge(require('./webpack.config'), {
  devtool: 'source-map',
  entry: {
    example: './example/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html'
    })
  ]
})
