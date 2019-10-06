/**
 * @file crypto
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
const fs = require('fs')
const crypto = require('crypto')

module.exports = ({publicKey, publicKeyPath, privateKey, privateKeyPath}) => {
  publicKey = publicKey || (publicKeyPath && fs.readFileSync(publicKeyPath))
  privateKey = privateKey || (privateKeyPath && fs.readFileSync(privateKeyPath))
  return {
    encrypt(data, {padding = crypto.RSA_NO_PADDING} = {}) {
      if (!publicKey) {
        const error = new Error('publicKey is not defined, maybe publicKeyPath is not defined.')
        error.code = 'ARGUMENT_ILLEGAL'
        throw error
      }
      return crypto.publicEncrypt({key: publicKey, padding}, Buffer.from(data)).toString('base64');
    },
    decrypt(data, {passphrase, padding = crypto.RSA_NO_PADDING} = {}) {
      if (!privateKey) {
        const error = new Error('privateKey is not defined, maybe privateKeyPath is not defined.')
        error.code = 'ARGUMENT_ILLEGAL'
        throw error
      }
      return String(crypto.privateDecrypt({key: privateKey, padding, passphrase}, Buffer.from(data, 'base64')))
    }
  }
}
