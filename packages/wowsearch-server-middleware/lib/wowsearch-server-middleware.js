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
    enableDelete = true,
    runTaskFile,
    scheduleInput,
    browserViewRoute = '/fileman',
    publicKeyPath,
    privateKeyPath
  } = {}
) {
  if (!publicKeyPath || !privateKeyPath) {
    throw new Error('publicKeyPath and privateKeyPath is required')
  }

  return [
    makeRouter({
      workPath,
      runTaskFile,
      scheduleInput,
      publicKeyPath,
      privateKeyPath
    }),
    fileman(workPath, { token: token, enableDelete, browserViewRoute })
  ]
}
