/**
 * @file crawl
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { CrawlerConfig } from 'wowsearch-parse/types/Config'
import * as fetch from 'isomorphic-fetch'
import { JSDOM } from 'jsdom'
import * as each from 'lodash.foreach'

import makeCheck from './makeCheckUrl'
import * as u from 'url'
import parseElementTree from 'wowsearch-parse'
import selectVal, { selectAll } from 'wowsearch-parse/selectVal'
import DocumentNode from 'wowsearch-parse/types/DocumentNode'

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

  const check = makeCheck({ start_urls: start_urls.concat('**'), stop_urls })
  const smartCrawlingUrls = []
  ;[].slice.apply(document.querySelectorAll('a')).map(function(node) {
    let href = node.getAttribute('href')
    if (href && isSameOrigin(href, fromUrl)) {
      href = u.resolve(fromUrl, href)
      let o = u.parse(href)
      // delete o.query
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

type CrawlResult = {
  documentNode?: DocumentNode
  smartCrawlingUrls?: string[]
}

export async function crawl(
  text: string,
  config: CrawlerConfig,
  fromUrl?
): Promise<CrawlResult> {
  const { document } = new JSDOM(text, { url: fromUrl }).window
  const {
    start_urls,
    stop_urls,
    strip_chars,
    selectors,
    selectors_exclude,
    smart_crawling,
    url_tpl,
    source_adaptor,
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

  const documentNode = parseElementTree(document, selectors)
  documentNode.href = fromUrl

  return {
    documentNode,
    smartCrawlingUrls
  }
}

export async function crawlByUrl(
  url: string,
  config: CrawlerConfig
): Promise<CrawlResult> {
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
      let res = await fetch(url)
      html = await res.text()
    } catch (e) {
      console.error(`URL: ${url}`, String(e))
      return null
    }
  }
  debug('html: %s', html)

  return crawl(html, config, url)
}

export async function pushDocumentNode(
  documentNode: DocumentNode,
  config: CrawlerConfig
) {
  const { url_tpl, source_adaptor } = config

  // Push
  const pushAdaptor = require(source_adaptor.name)(source_adaptor.options)
  const result = await pushAdaptor(documentNode, config)
  return result !== false
}

export async function push(text: string, config: CrawlerConfig, fromUrl?) {
  const { documentNode } = await crawl(text, config, fromUrl)
  return pushDocumentNode(documentNode, config)
}

export async function pushByUrl(url: string, config: CrawlerConfig) {
  const { documentNode } = await crawlByUrl(url, config)
  return pushDocumentNode(documentNode, config)
}
