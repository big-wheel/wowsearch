'use strict'

jest.mock('child_process')

const wowsearchServer = require('..')
const { transformConfig } = require('../lib/runTask')
const crypto = require('../lib/crypto')
const nps = require('path')
const request = require('supertest')
const mockStandalone = require('wowsearch-standalone')
const app = require('express')()

const config = {
  publicKeyPath: nps.join(__dirname, 'public.crt'),
  privateKeyPath: nps.join(__dirname, 'private.pem')
}

app.use(wowsearchServer(nps.join(__dirname, 'workspace'), config))

const cry = crypto(config)

jest.setTimeout(10000)

describe('wowsearch-server', () => {
  it('get /run 404', done => {
    request(app)
      .get('/run')
      .expect(404)
      .end(done)
  })

  it('post /run 200', done => {
    request(app)
      .post('/run')
      .expect(200)
      .end(done)
  })

  it('get /run-date-list 200', done => {
    request(app)
      .get('/run-date-list')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        expect(res.body).toEqual([])

        request(app)
          .post('/run')
          .end((err) => {
            if (err) {
              return done(err)
            }
          })
      })
  })

  it('transformConfig', function() {
    expect(
      transformConfig(
        {
          a: {
            value: cry.encrypt('foo')
          },
          b: cry.encrypt('bar')
        },
        cry.decrypt
      )
    ).toMatchInlineSnapshot(`
Object {
  "a": Object {
    "value": "foo",
  },
  "b": "bar",
}
`)
  })
})
