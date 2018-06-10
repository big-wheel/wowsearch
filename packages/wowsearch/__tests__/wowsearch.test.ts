/**
 * @file main.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { readFileSync } from 'fs'
import * as readJSONSync from 'read-json-sync'
import { makeFixture } from './help'
import { default as wowsearch, getUrlList } from '../index'

describe('wowsearch', function() {
  it('getUrlList', async function() {
    const urls = await getUrlList(
      {
        sitemap_urls_patterns: [/.*/],
        stop_urls: [],
        selectors: {},
        start_urls: [/.*/],
        sitemap_urls: ['http://origin.eux.baidu.com:8666/sitemap.xml', 'http://origin.eux.baidu.com:8666/sitemap.xml']
      }
    )
    console.log(urls)
    expect(urls).toMatchSnapshot()
  })

  it('crawl text with js_render', async function() {
    await wowsearch(
      readJSONSync(makeFixture('cookbook.json'))
    )
  })

})
