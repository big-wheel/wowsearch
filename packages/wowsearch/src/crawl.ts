/**
 * @file crawl
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import {
  CrawlerConfig,
  MatchedUrlEntity
} from 'wowsearch-parse/dist/types/Config'
import * as got from 'got'
import { JSDOM } from 'jsdom'
import * as each from 'lodash.foreach'

import makeCheck from './makeCheckUrl'
import * as u from 'url'
import parseElementTree from 'wowsearch-parse'
import selectVal, { selectAll } from 'wowsearch-parse/dist/selectVal'
import DocumentNode from 'wowsearch-parse/dist/types/DocumentNode'

const debug = require('debug')('wowsearch:crawl')

const protocolPorts = new Map<string, number>([
  ['https:', 443],
  ['http:', 80],
  [null, null]
])
export type DocumentNodeMap = {
  [url: string]: DocumentNode
}

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
): MatchedUrlEntity[] {
  const {
    start_urls_patterns,
    smart_crawling_selector,
    stop_urls_patterns,
    force_crawling_urls
  } = config

  const check = makeCheck(start_urls_patterns, stop_urls_patterns)
  const smartCrawlingUrls = []
  selectAll(document, smart_crawling_selector).map(function(node) {
    let href = node.getAttribute('href')
    let res
    if (href && isSameOrigin(href, fromUrl)) {
      href = u.resolve(fromUrl, href)
      // let o = u.parse(href)
      // delete o.query
      // delete o.search
      // delete o.hash
      // href = u.format(o)
      debug('checked href: %s, isSameOrigin', href)
      if ((res = check(href)) || force_crawling_urls) {
        fromUrl !== href &&
          smartCrawlingUrls.indexOf(href) < 0 &&
          smartCrawlingUrls.push({
            url: href,
            rule: res
          })
      }
    } else {
      debug('checked href: %s, not matched', href)
    }
  })

  debug(
    'smartCrawlingUrls: %o, from url: %s',
    smartCrawlingUrls.map(u => u.url),
    fromUrl
  )
  return smartCrawlingUrls
}

type CrawlResult = {
  documentNode?: DocumentNode
  smartCrawlingUrls?: MatchedUrlEntity[]
}

export function crawl(
  text: string,
  config: CrawlerConfig,
  fromUrl?
): CrawlResult {
  const { document } = new JSDOM(text, { url: fromUrl }).window
  const {
    start_urls,
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
    debug('smartCrawlingUrls: %o', smartCrawlingUrls.map(x => x.url))
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

export async function createBrowser(timeout) {
  const puppeteer = require('puppeteer')
  return await puppeteer.launch({
    headless: !process.env.WOWSEARCH_NO_HEADLESS,
    timeout,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

export async function pushDocumentNode(
  documentNode: DocumentNode,
  config: CrawlerConfig
) {
  const map: DocumentNodeMap = { [documentNode.href]: documentNode }
  return pushDocumentNodeMap(map, config)
}

export async function pushDocumentNodeMap(
  documentNodeMap: DocumentNodeMap,
  config: CrawlerConfig
) {
  const { url_tpl, source_adaptor } = config
  // Push
  const pushAdaptor = require(source_adaptor.name)(
    source_adaptor.options,
    config
  )
  const result = await pushAdaptor(documentNodeMap, config)
  return result !== false
}

export async function crawlByUrl(
  url: string,
  config: CrawlerConfig,
  browser?: any
): Promise<CrawlResult> {
  let html
  let useBrowser
  try {
    if (config.js_render) {
      // @ts-ignore
      useBrowser = browser || (await createBrowser(config.timeout))
      const page = await useBrowser.newPage()
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: config.timeout
      })
      config.js_waitfor && (await page.waitFor(config.js_waitfor))
      html = await page.evaluate(() => {
        return document.documentElement.outerHTML
      })
      await page.close()
    } else {
      let res = await got.get(encodeURI(url), { timeout: config.timeout })
      html = res.body
    }
  } catch (e) {
    console.error(`URL: ${url}`, String(e))
    return {
      smartCrawlingUrls: []
    }
  } finally {
    if (useBrowser !== browser) {
      await useBrowser.close()
    }
  }
  debug('html: %s', html)

  return crawl(html, config, url)
}

export async function push(text: string, config: CrawlerConfig, fromUrl?) {
  const { documentNode } = await crawl(text, config, fromUrl)
  return pushDocumentNode(documentNode, config)
}

export async function pushByUrl(url: string, config: CrawlerConfig) {
  const { documentNode } = await crawlByUrl(url, config)
  return pushDocumentNode(documentNode, config)
}
