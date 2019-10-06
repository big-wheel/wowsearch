/**
 * @file worker
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
const schedule = require('node-schedule')
const {robust} = require('memoize-fn')
const isEq = require('lodash.isequal')
const queueFn = require('./queueFn')

if (typeof process.send === 'function') {
  const [input] = process.argv.slice(2)
  const arg = JSON.parse(input)
  const { publicKeyPath, privateKeyPath, scheduleInput, workPath, runTaskFile = require.resolve('./runTask.js') } = arg

  const run = queueFn(async (arg, glob) => {
    const ent = {}
    ent.start = new Date()
    try {
      ent.result = await require(runTaskFile)(Object.assign(arg, {configFileGlob: glob}))
    } catch (e) {
      ent.error = e
    }
    ent.end = new Date()
    process.send({
      type: 'done',
      value: ent
    })
  }, {concurrency: 1, isEqual: isEq})

  scheduleInput && schedule.scheduleJob(scheduleInput, () => {
    run(arg)
  })

  process.on('message', async ({type, value}) => {
    switch (type) {
      case 'run':
        run(arg, value)
        break
    }
  })
}
