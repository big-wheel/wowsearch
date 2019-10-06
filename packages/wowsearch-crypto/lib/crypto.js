/**
 * @file crypto
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
const fs = require('fs')
const crypto = require('crypto')

module.exports = ({publicKeyPath, privateKeyPath}) => {
  const publicKey = publicKeyPath && fs.readFileSync(publicKeyPath)
  const privateKey = privateKeyPath && fs.readFileSync(privateKeyPath)
  return {
    encrypt(data) {
      if (!publicKey) {
        const error = new Error('publicKey is not defined, maybe publicKeyPath is not defined.')
        error.code = 'ARGUMENT_ILLEGAL'
        throw error
      }
      return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
    },
    decrypt(data) {
      if (!privateKey) {
        const error = new Error('privateKey is not defined, maybe privateKeyPath is not defined.')
        error.code = 'ARGUMENT_ILLEGAL'
        throw error
      }
      return String(crypto.privateDecrypt(privateKey, Buffer.from(data, 'base64')))
    }
  }
}
