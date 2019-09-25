/**
 * @file got
 * @author Cuttle Cong
 * @date 2019/9/25
 *
 */


module.exports = {
  post: jest.fn(() => {
    return Promise.resolve({
      body: {}
    })
  })
}
