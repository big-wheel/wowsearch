/**
 * @file webpack.config.js
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
const MiniCSSPlugin = require('mini-css-extract-plugin')
const nps = require('path')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  plugins: [
    new MiniCSSPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[id].css'
      // disable: isDev
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        chunks: 'all'
      }
    }
  },
  context: __dirname,
  output: {
  },
  devServer: {
    hot: true
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        include: [
          /wowsearch/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true
            }
          }
        ]
      },
      {
        test: /\.less?$/,
        use: [
          {
            loader: MiniCSSPlugin.loader,
            options: {
              // hmr: isDev
            }
          },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins(/*loader*/) {
                return [require('autoprefixer')()]
              }
            }
          },
          {
            loader: 'less-loader'
          },
          {
            loader: 'less-modify-var-loader',
            options: {
              filePath: nps.join(__dirname, '_replace.less')
            }
          }
        ]
      }
    ]
  }
}
