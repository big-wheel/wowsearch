/**
 * @file match.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import match from '../../wowsearch-parse/match'

describe('match', function() {
  it('when match rule is string', async function() {
    expect(
      match('https://www.bilibili.com/bangumi/play/ep200014', '123')
    ).toBeFalsy()
    expect(
      match(
        'https://www.bilibili.com/bangumi/play/ep200014',
        'https://www.bilibili.com/bangumi/play/ep20001'
      )
    ).toBeFalsy()
    expect(
      match(
        'https://www.bilibili.com/bangumi/play/ep200014',
        'https://www.bilibili.com/bangumi/play/ep200014'
      )
    ).toBeTruthy()
    expect(
      match(
        'https://www.bilibili.com/bangumi/play/ep200014',
        'https://www.bilibili.com/bangumi/play/ep2000145'
      )
    ).toBeFalsy()

    expect(
      match(
        'https://www.bilibili.com/bangumi/play/ep200014/*_zh',
        'https://www.bilibili.com/bangumi/play/ep200014/'
      )
    ).toBeFalsy()

    expect(
      match(
        'https://www.bilibili.com/bangumi/play/ep200014/*_zh',
        'https://www.bilibili.com/bangumi/play/ep200014/_zh'
      )
    ).toBeTruthy()
  })

  it('when match rule is Regexp', async function() {
    expect(
      match(
        /https:\/\/www.bilibili.com\/bangumi\/play\/ep200014\/.*_zh/,
        'https://www.bilibili.com/bangumi/play/ep200014/_zh'
      )
    ).toBeTruthy()
  })

  it('when match rule is function', async function() {
    expect(
      match(
        (value) => value === '1',
        'https://www.bilibili.com/bangumi/play/ep200014/_zh'
      )
    ).toBeFalsy()

    expect(
      match(
        (value) => value === '1',
        '1'
      )
    ).toBeTruthy()
  })
})
