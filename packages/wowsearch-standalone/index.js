/**
 * @file index.ts
 * @author imcuttle
 *
 */

const nps = require('path')
const globby = require('globby')
const findUp = require('find-up')

module.exports = async ({
  cwd = process.cwd(),
  configRootPath = nps.join(cwd, 'configs'),
  transformConfig,
  configFileGlob
} = {}) => {
  const path = findUp.sync('.env', { cwd })
  path && require('dotenv').config({ path })

  const wowsearch = require('wowsearch').default
  configFileGlob = configFileGlob || process.env.CONFIG_FILE_GLOB || '*.{js.json}'

  const configFiles = globby.sync(configFileGlob, {
    onlyFiles: true,
    absolute: true,
    cwd: configRootPath
  })

  return Promise.all(configFiles.map(async configFile => {
    let config = require(configFile)
    if (typeof transformConfig === 'function') {
      config = await transformConfig(configFile, config)
    }
    delete require.cache[configFile]

    try {
      if (await wowsearch(config)) {
        console.log('File', configFile, 'done!')
        return true
      }
      return false
    } catch (e) {
      console.error('Error in ', configFile, e)
      throw e
    }
  }))

}
