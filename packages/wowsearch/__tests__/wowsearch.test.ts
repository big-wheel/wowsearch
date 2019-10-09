/**
 * @file main.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { readFileSync } from 'fs'
import { inspect } from 'util'
import * as readJSONSync from 'read-json-sync'
import { makeFixture } from './help'
import { default as wowsearch, getUrlList } from '../index'

describe('wowsearch', function() {
  it.skip('getUrlList', async function() {
    const urls = await getUrlList(
      {
        selectors: {},
        start_urls_patterns: [/.*/],
        sitemap_urls: ['https://imcuttle.github.io/sitemap.xml']
      }
    )
    expect(urls.map(x => x.url)).toMatchSnapshot()
  })
})
