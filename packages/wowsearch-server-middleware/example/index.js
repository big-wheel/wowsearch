/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */

const middle = require('..')
const app = require('express')()
const nps = require('path')
const dirview = require('express-dirview-middleware')

app.use(
  middle(nps.join(__dirname, 'workspace'), {
    token: '',
    privateKeyPath: nps.join(__dirname, 'private.pem'),
    publicKeyPath: nps.join(__dirname, 'public.crt')
  })
).use(dirview({ root: nps.join(__dirname, 'workspace') }))


app.listen(9090, () => {
  console.log('Example run on http://localhost:9090')
})
