/**
 * @file index.ts
 * @author imcuttle
 *
 */

const nps = require('path')
const globby = require('globby')
const findUp = require('find-up')

module.exports = async ({ cwd = process.cwd(), configRootPath = nps.join(cwd, 'configs') } = {}) => {
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
    const config = require(configFile)
    try {
      console.log(await wowsearch(config))
    } catch (e) {
      console.error(e)
    }
  }
}
