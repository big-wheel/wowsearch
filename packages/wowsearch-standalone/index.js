/**
 * @file index.ts
 * @author imcuttle
 *
 */

const nps = require('path')
const globby = require('globby')
const findUp = require('find-up')

module.exports = async ({ cwd = process.cwd(), configRootPath = nps.join(cwd, 'configs'), transformConfig } = {}) => {
  const path = findUp.sync('.env', { cwd })
  path && require('dotenv').config({ path })

  const wowsearch = require('wowsearch').default
  const { CONFIG_FILE_GLOB = '*.{js,json}' } = process.env

  const configFiles = globby.sync(CONFIG_FILE_GLOB, {
    onlyFiles: true,
    absolute: true,
    cwd: configRootPath
  })

  for (const configFile of configFiles) {
    let config = require(configFile)
    if (typeof transformConfig === 'function') {
      config = await transformConfig(configFile, config)
    }
    delete require.cache[configFile]

    try {
      return await wowsearch(config)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
