/**
 * @file runTask
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */

const standalone = require('wowsearch-standalone')
const mapObj = require('map-obj')
const crypto = require('./crypto')

const transformConfig = (config, transformValue) => {
  return mapObj(
    config,
    (sourceKey, sourceValue, source) => {
      if (typeof sourceValue === 'string') {
        try {
          sourceValue = transformValue(sourceValue)
        } catch (e) {}
      }
      return [sourceKey, sourceValue]
    },
    { deep: true }
  )
}

module.exports = function runTask({
  workPath,
  configFileGlob,
  publicKey,
  privateKey,
  publicKeyPath,
  privateKeyPath
}) {
  const cry = crypto({ privateKey, publicKey, privateKeyPath, publicKeyPath })

  return standalone({
    configFileGlob,
    configRootPath: workPath,
    cwd: workPath,
    transformConfig: (configFile, config) => {
      return transformConfig(config, cry.decrypt)
    }
  })
}

module.exports.transformConfig = transformConfig
