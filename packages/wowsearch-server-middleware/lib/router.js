/**
 * @file router
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
const { Router } = require('express')
const fs = require('fs')
const nps = require('path')
const cp = require('child_process')

const MAX_SIZE = 100

module.exports = ({
  publicKeyPath,
  privateKeyPath,
  scheduleInput,
  runTaskFile,
  workPath
} = {}) => {
  const child = cp.fork(
    nps.join(__dirname, 'worker.js'),
    [
      JSON.stringify({
        publicKeyPath,
        privateKeyPath,
        scheduleInput,
        runTaskFile,
        workPath
      })
    ],
    {
      stdio: 'inherit'
    }
  )
  const runDateList = []
  child.on('message', ({ type, value }) => {
    switch (type) {
      case 'done':
        while (runDateList.length >= MAX_SIZE) {
          runDateList.pop()
        }
        runDateList.unshift(value)
    }
  })

  return Object.assign(
    new Router()
      .post('/run', (req, res) => {
        if (child) {
          child.send({ type: 'run' })
          res.end('ok')
        }
      })
      .post('/run/:glob', (req, res) => {
        if (child) {
          child.send({ type: 'run', value: req.params.glob })
          res.end('ok ' + req.params.glob)
        }
      })
      .get('/run-date-list', (req, res) => {
        res.json(runDateList)
      })
      .get('/public-key', (req, res) => {
        res.end(fs.readFileSync(publicKeyPath).toString())
      }),
    {
      childProcessor: child
    }
  )
}
