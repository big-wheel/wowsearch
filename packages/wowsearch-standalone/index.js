/**
 * @file index.ts
 * @author imcuttle
 *
 */

require('dotenv').config()
const nps = require('path')
const globby = require('globby')
const wowsearch = require('wowsearch').default

const { CONFIG_FILE_GLOB } = process.env

const configFiles = globby.sync(CONFIG_FILE_GLOB, {
  onlyFiles: true,
  absolute: true,
  cwd: nps.join(__dirname, 'configs')
})

;(async () => {
  for (const configFile of configFiles) {
    const config = require(configFile)
    try {
      console.log(await wowsearch(config))
    } catch (e) {
      console.error(e)
    }
  }
})()


