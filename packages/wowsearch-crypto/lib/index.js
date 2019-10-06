'use strict'

module.exports = wowserchCrypto

const crypto = require('./crypto')

function wowserchCrypto({
  publicKeyPath = wowserchCrypto.defaultOptions.publicKeyPath,
  publicKey = wowserchCrypto.defaultOptions.publicKey,
  privateKeyPath = wowserchCrypto.defaultOptions.privateKeyPath,
  privateKey = wowserchCrypto.defaultOptions.privateKey,
} = {}) {
  return crypto({privateKey, publicKey, publicKeyPath, privateKeyPath })
}


const defaultOptions = wowserchCrypto.defaultOptions = {
  publicKeyPath: process.env['WOWSEARCH_CRYPTO_PUBLIC_KEY_PATH'],
  publicKey: process.env['WOWSEARCH_CRYPTO_PUBLIC_KEY'],
  privateKeyPath: process.env['WOWSEARCH_CRYPTO_PRIVATE_KEY_PATH'],
  privateKey: process.env['WOWSEARCH_CRYPTO_PRIVATE_KEY'],
}
