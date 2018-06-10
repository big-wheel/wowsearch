/**
 * @file crawl
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { CrawlerConfig } from './types/Config'
import * as request from 'request-promise-native'
import * as select from 'xpath.js'
import { DOMParser } from 'xmldom'
import * as cheerio from 'cheerio'
import * as each from 'lodash.foreach'
import makeCheck from './makeCheckUrl'
import * as u from 'url'

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

export function crawl(
  text: string,
  config: CrawlerConfig,
  fromUrl = ''
): { smartCrawlingUrls; crawlTexts } {
  const $ = cheerio.load(text)
  let doc
  const {
    start_urls,
    stop_urls,
    strip_chars,
    selectors,
    selectors_exclude,
    smart_crawling,
    force_crawling_urls
  } = config
  const check = makeCheck({ start_urls, stop_urls })

  let smartCrawlingUrls = []
  if (smart_crawling) {
    $('a').map(function() {
      let href = $(this).attr('href')
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
  }

  // TODO
  // Do filter about start_urls and stop_urls.

  if (selectors_exclude) {
    each(selectors_exclude, (val, key) => {
      $(val).remove()
    })
  }

  let crawlTexts = []
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
    let text = null
    if (typeof value === 'string') {
      value = {
        type: 'css',
        selector: value
      }
    }
    if (value.type === 'css' || !value.type) {
      text = $(value.selector).text()
      debug('css selector: %s, matched: %o.', value.selector, text)
    } else {
      if (!doc) {
        doc = new DOMParser({
          errorHandler: {
            warning: null,
            error: console.error,
            fatalError: console.error
          }
        }).parseFromString($.html())
      }

      let nodes = select(doc, value.selector)
      text = nodes.map(node => node.textContent).join('')
      debug('xpath selector: %s, matched: %o.', value.selector, text)
    }
    let strip_chars = value.strip_chars || config.strip_chars || ''
    crawlTexts[key] = text
      ? text.replace(
          new RegExp(`(^[${strip_chars}]+)|(${strip_chars}]+$)`, 'g'),
          ''
        )
      : value.hasOwnProperty('default_value')
        ? value.default_value
        : null
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

  let { crawlTexts, smartCrawlingUrls } = await crawl(html, config, url)
  debug('url: %s, crawlTexts: %o', url, crawlTexts)
  return { crawlTexts, smartCrawlingUrls }
}
