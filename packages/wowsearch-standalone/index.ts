/**
 * @file index.ts
 * @author imcuttle
 *
 */

require('dotenv').config()
const nps = require('path')
const globby = require('globby')

const { CONFIG_FILE_GLOB } = process.env

const configFiles = globby.sync(CONFIG_FILE_GLOB, {
  onlyFiles: true,
  cwd: nps.join(__dirname, 'configs')
})

console.log(configFiles)
