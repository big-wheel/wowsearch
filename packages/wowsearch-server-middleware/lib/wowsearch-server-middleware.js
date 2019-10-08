'use strict'

module.exports = wowsearchServerMiddleware

const nps = require('path')
const makeRouter = require('./router')
const makeCrypto = require('./crypto')
const fileman = require('express-restful-fileman')

function wowsearchServerMiddleware(
  workPath,
  {
    token,
    concurrency,
    enableDelete = true,
    runTaskFile,
    scheduleInput = '0 0 * * 0',
    browserViewRoute = '/fileman',
    browserViewOptions = '/fileman',
    publicKeyPath,
    publicKey,
    privateKeyPath,
    privateKey,
    disableFileman
  } = {}
) {
  return [
    makeRouter({
      workPath,
      runTaskFile,
      scheduleInput,
      privateKey,
      concurrency,
      publicKey,
      publicKeyPath,
      privateKeyPath
    }),
    !disableFileman && fileman(workPath, { token: token, enableDelete, browserViewRoute, browserViewOptions })
  ].filter(Boolean)
}
