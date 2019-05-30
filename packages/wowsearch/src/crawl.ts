/**
 * @file crawl
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { CrawlerConfig } from './types/Config'
import * as request from 'request-promise-native'
import { JSDOM } from 'jsdom'
import * as each from 'lodash.foreach'

import makeCheck from './makeCheckUrl'
import * as u from 'url'
import DocumentNode from './types/DocumentNode'
import selectVal, {selectAll} from './selectVal';

const debug = require('debug')('wowsearch:crawl')

const protocolPorts = new Map<any, number>([
  ['https:', 443],
  ['http:', 80],
  [null, null]
])

export function isSameOrigin(valueUrl: string, fromUrl?: string) {
  valueUrl = valueUrl.trim()
  let { pathname, protocol, hostname, port } = u.parse(valueUrl)
  if (valueUrl.startsWith('//') || protocol == null) {
    return true
  }
  if (!fromUrl) {
    return false
  }
  const fo = u.parse(fromUrl)
  fo.port = fo.port || <any>protocolPorts.get(fo.protocol)
  port = port || <any>protocolPorts.get(protocol)
  return (
    fo.protocol === protocol && fo.hostname === hostname && fo.port === port
  )
}

function getCrawlingUrls(
  document,
  { fromUrl = '', config }: { fromUrl?: string; config?: CrawlerConfig } = {}
) {
  const { start_urls, stop_urls, force_crawling_urls } = config

  const check = makeCheck({ start_urls, stop_urls })
  const smartCrawlingUrls = []
  document.querySelectorAll('a').map(function(node) {
    let href = node.getAttribute('href')
    if (href && isSameOrigin(href, fromUrl)) {
      href = u.resolve(fromUrl, href)
      let o = u.parse(href)
      delete o.query
      delete o.search
      delete o.hash
      href = u.format(o)

      debug('checked href: %s, isSameOrigin', href)
      if (force_crawling_urls || check(href)) {
        fromUrl !== href &&
          smartCrawlingUrls.indexOf(href) < 0 &&
          smartCrawlingUrls.push(href)
      }
    } else {
      debug('checked href: %s, not matched', href)
    }
  })

  debug('smartCrawlingUrls: %o, from url: %s', smartCrawlingUrls, fromUrl)
  return smartCrawlingUrls
}



export function crawl(
  text: string,
  config: CrawlerConfig,
  fromUrl = ''
): { smartCrawlingUrls; crawlTexts } {
  const documentNode = new DocumentNode()

  const { document } = new JSDOM(text, { url: fromUrl }).window
  const {
    start_urls,
    stop_urls,
    strip_chars,
    selectors,
    selectors_exclude,
    smart_crawling,
    force_crawling_urls
  } = config

  let smartCrawlingUrls = []
  if (smart_crawling) {
    smartCrawlingUrls = getCrawlingUrls(document, { fromUrl, config })
  }

  // TODO
  // Do filter about start_urls and stop_urls.
  if (selectors_exclude) {
    each(selectors_exclude, (val, key) => {
      const nodes = selectAll(document, val)
      nodes.forEach(node => node.remove())
    })
  }

  let crawlTexts = {}
  // { lvl0:
  //       lvl1:
  //       lvl2:
  //       lvl3:
  //       lvl4: null,
  //       lvl5: null,
  //       lvl6: null,
  //       text:

  // selectors.

  each(selectors, (value, key) => {
    // The global Selector
    if (value && value.global) {
      documentNode.global.set(key, selectVal(value, document).text)
    } else {
    }
  })

  return { crawlTexts, smartCrawlingUrls }
}

export async function crawlByUrl(url: string, config: CrawlerConfig) {
  let html
  if (config.js_render) {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
      timeout: 100000,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 100000 })
    config.js_waitfor && (await page.waitFor(config.js_waitfor))
    html = await page.evaluate(() => {
      return document.documentElement.outerHTML
    })
    await browser.close()
  } else {
    try {
      html = await request(encodeURI(decodeURI(url)))
    } catch (e) {
      console.error(`URL: ${url}`, String(e))
      return {}
    }
  }
  debug('html: %s', html)

  let { crawlTexts, smartCrawlingUrls } = await crawl(html, config, url)
  debug('url: %s, crawlTexts: %o', url, crawlTexts)
  return { crawlTexts, smartCrawlingUrls }
}
