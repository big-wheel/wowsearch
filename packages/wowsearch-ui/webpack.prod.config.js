/**
 * @file webpack.config.js
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
const path = require('path')
const merge = require('webpack-merge')
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin')
const { name } = require('./package')

const externals =
  [
    function(context, request, callback) {
      if (['.less', '.css', '.sass'].includes(path.extname(request))) {
        return callback()
      }
      const dep = Object.keys(require('./package').dependencies).concat(
        Object.keys(require('./package').peerDependencies || {})
      )
      const f = dep.find(name => request.startsWith(name))
      if (f) {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    }
  ]

const libraryName = 'WowsearchUI'

module.exports = [
  {
    externals,
    output: {
      library: libraryName,
      filename: `${name}.umd.js`,
      libraryTarget: 'umd',
    },
    plugins: []
  },
  {
    externals,
    output: {
      filename: `${name}.cjs.js`,
      libraryTarget: 'commonjs2'
    },
    plugins: []
  },
  {
    mode: 'production',
    entry: './standalone.js',
    output: {
      filename: `${name}.standalone.js`,
      library: libraryName,
      libraryTarget: 'umd'
    },
  }
].map(config => merge(require('./webpack.config'), {
  devtool: false,
  mode: 'development'
}, config))
