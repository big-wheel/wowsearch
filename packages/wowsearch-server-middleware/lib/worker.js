/**
 * @file worker
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
const schedule = require('node-schedule')

if (typeof process.send === 'function') {
  const [input] = process.argv.slice(2)
  const arg = JSON.parse(input)
  const { publicKeyPath, privateKeyPath, scheduleInput, workPath, runTaskFile = require.resolve('./runTask.js') } = arg

  const run = async (arg) => {
    const range = []
    range.push(new Date())
    await require(runTaskFile)(arg)
    range.push(new Date())
    process.send({
      type: 'done',
      value: range
    })
  }
  schedule.scheduleJob(scheduleInput, () => {
    run(arg)
  })

  process.on('message', async ({type}) => {
    switch (type) {
      case 'run':
        run(arg)
        break
    }
  })
}
