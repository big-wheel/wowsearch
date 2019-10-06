'use strict'

module.exports = wowserchCrypto

const crypto = require('./crypto')

function wowserchCrypto({
  publicKeyPath = wowserchCrypto.defaultOptions.publicKeyPath,
  privateKeyPath = wowserchCrypto.defaultOptions.privateKeyPath
} = {}) {
  return crypto({ publicKeyPath, privateKeyPath })
}


const defaultOptions = wowserchCrypto.defaultOptions = {
  publicKeyPath: process.env['WOWSEARCH_CRYPTO_PUBLIC_KEY_PATH'],
  privateKeyPath: process.env['WOWSEARCH_CRYPTO_PRIVATE_KEY_PATH']
}
