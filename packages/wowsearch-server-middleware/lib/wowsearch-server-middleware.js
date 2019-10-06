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
    scheduleInput = '0 0 * * 0',
    browserViewRoute = '/fileman',
    publicKeyPath,
    publicKey,
    privateKeyPath,
    privateKey,
  } = {}
) {
  if (!publicKeyPath || !publicKey) {
    throw new Error('publicKeyPath or publicKey is required')
  }

  if (!privateKeyPath || !privateKey) {
    throw new Error('privateKeyPath or privateKey is required')
  }

  return [
    makeRouter({
      workPath,
      runTaskFile,
      scheduleInput,
      privateKey,
      publicKey,
      publicKeyPath,
      privateKeyPath
    }),
    fileman(workPath, { token: token, enableDelete, browserViewRoute })
  ]
}
