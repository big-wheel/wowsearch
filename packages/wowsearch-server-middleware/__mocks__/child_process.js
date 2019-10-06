/**
 * @file wowsearch-standalone
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */

module.exports = {
  fork: jest.fn(() => {
    return {
      send: () => {},
      on: () => {}
    }
  })
}
