/**
 * @file runPQueue
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
const {robust} = require('memoize-fn')
const PQueue = require('p-queue').default

module.exports = (fn, { concurrency, isEqual = () => false } = {}) => {
  const queue = new PQueue({ concurrency })
  const cache = new Map()
  const mFn = robust(fn, {cache})

  return function() {
    const argvs = Array.from(arguments)

    queue.clear()

    console.error(cache)

    for (const key of cache.keys()) {
      if (cache.get(key).this === this && isEqual(argvs, key)) {
        return cache.get(key).result
      }
    }

    return queue.add(async () => {
      try {
        return await mFn.apply(this, arguments)
      } finally {
        for (const key of cache.keys()) {
          if (cache.get(key).this === this && isEqual(argvs, key)) {
            cache.delete(key)
          }
        }
      }
    })
  }
}
