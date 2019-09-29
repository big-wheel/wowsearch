/**
 * @file main.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
process.env.DEBUG = 'wowsearch:crawl'

import { readFileSync } from 'fs'
import { makeFixture } from './help'
import { crawl, push, isSameOrigin, crawlByUrl } from '../src/crawl'

jest.mock('got')

import * as got from 'got'

describe('push', function() {
  it('should push', async function() {
    const result = await push(
      readFileSync(makeFixture('text.html')).toString(),
      {
        source_adaptor: {
          name: 'wowsearch-elastic-adaptor/node',
          options: {
            index_name: 'temp'
          }
        },
        // strip_chars: 'r',
        selectors: {
          lvl0: '#readme .package-name-redundant',
          lvl1: '#readme h1:not(.package-name-redundant)',
          lvl2: {
            selector: '//*[@id="readme"]//h2',
            type: 'xpath'
          },
          lvl3: {
            selector: '#readme h3'
          },
          lvl4: { selector: '#readme h4', default_value: 'abc' },
          text: '#readme > p, #readme li, #readme code, #readme pre'
        },
        selectors_exclude: ['#readme .deep-link']
      }
    )

    expect(result).toBeTruthy()
    expect(got.post.mock.calls.length).toBe(1)

    const calls = got.post.mock.calls[0]
    expect(calls.length).toBe(2)
    expect(calls[0]).toMatchInlineSnapshot(`"http://localhost:9200/temp/_bulk"`)
    expect(calls[1]).toMatchSnapshot()
  })
})

describe('crawl', function() {
  it('crawl text', async function() {
    const texts = await crawl(
      readFileSync(makeFixture('text.html')).toString(),
      {
        // strip_chars: 'r',
        selectors: {
          lvl0: '#readme .package-name-redundant',
          lvl1: '#readme h1:not(.package-name-redundant)',
          lvl2: {
            selector: '//*[@id="readme"]//h2',
            type: 'xpath'
          },
          lvl3: {
            selector: '#readme h3'
          },
          lvl4: { selector: '#readme h4', default_value: 'abc' },
          text: '#readme > p, #readme li, #readme code, #readme pre'
        },
        selectors_exclude: ['#readme .deep-link']
      }
    )

    expect(texts).toMatchSnapshot()
  })

  it('crawl text when smart_crawling', async function() {
    const texts = await crawl(
      readFileSync(makeFixture('text.html')).toString(),
      {
        smart_crawling: true,
        start_urls: ['https://npmjs.com/settings/**'],
        selectors: {
          lvl0: '#readme .package-name-redundant',
          lvl1: '#readme h1:not(.package-name-redundant)',
          lvl2: {
            selector: '//*[@id="readme"]//h2',
            type: 'xpath'
          },
          lvl3: {
            selector: '#readme h3'
          },
          lvl4: { selector: '#readme h4', default_value: 'abc' },
          text: '#readme p, #readme li, #readme code'
        },
        selectors_exclude: ['#readme .deep-link']
      },
      'https://npmjs.com/package/robots'
    )
  })

  it('crawl text when smart_crawling and force_crawling_urls', async function() {
    const texts = await crawl(
      readFileSync(makeFixture('text.html')).toString(),
      {
        smart_crawling: true,
        force_crawling_urls: true,
        start_urls: [],
        selectors: {
          lvl0: '#readme .package-name-redundant',
          lvl1: '#readme h1:not(.package-name-redundant)',
          lvl2: {
            selector: '//*[@id="readme"]//h2',
            type: 'xpath'
          },
          lvl3: {
            selector: '#readme h3'
          },
          lvl4: { selector: '#readme h4', default_value: 'abc' },
          text: '#readme p, #readme li, #readme code'
        },
        selectors_exclude: ['#readme .deep-link']
      },
      'https://npmjs.com/package/robots'
    )

    expect(texts).toMatchSnapshot()
  })

  it('crawl text with js_render', async function() {
    jest.setTimeout(10000)
    const texts = await crawlByUrl('https://www.npmjs.com/package/the-answer', {
      js_render: true,
      selectors: {
        lvl0: '#readme .package-name-redundant',
        lvl1: '#readme h1:not(.package-name-redundant)',
        lvl2: {
          selector: '//*[@id="readme"]//h2',
          type: 'xpath'
        },
        lvl3: {
          selector: '#readme h3'
        },
        lvl4: '#readme h4',
        text: '#readme p, #readme li, #readme code'
      },
      selectors_exclude: ['#readme .deep-link']
    })

    expect(texts).toMatchSnapshot()
  })

  it('should crawl nothing', function() {
    const texts = crawl(readFileSync(makeFixture('text.html')).toString(), {
      selectors: {}
    })

    expect(texts).toMatchSnapshot()
  })

  it('should isSameOrigin', function() {
    expect(isSameOrigin('/same')).toBeTruthy()
    expect(isSameOrigin('//same')).toBeTruthy()
    expect(isSameOrigin('http://same')).toBeFalsy()
  })

  it('should isSameOrigin when fromUrl', function() {
    expect(
      isSameOrigin('http://www.baidu.com', 'http://www.baidu.com')
    ).toBeTruthy()
    expect(
      isSameOrigin('http://www.baidu.com/wdwwa', 'http://www.baidu.com/ajha')
    ).toBeTruthy()
  })
})
