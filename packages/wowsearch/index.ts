/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { Config, normalize } from 'wowsearch-parse/dist/types/Config'
import {crawl, crawlByUrl, pushDocumentNode, createBrowser, pushDocumentNodeMap} from './src/crawl'
import match, { isRule, Rule } from 'wowsearch-parse/dist/match'
import parseSitemap from './src/parseSitemap'
const debug = require('debug')('wowsearch')

import PQueue from 'p-queue'
import * as uniq from 'lodash.uniq'
import makeCheck from './src/makeCheckUrl'

export async function getUrlList(config: Config) {
  const {
    concurrency,
    start_urls,
    stop_urls,
    smart_crawling,
    force_crawling_urls,
    sitemap_urls,
    sitemap_urls_patterns,
    force_sitemap_urls_crawling
  } = config
  const check = makeCheck({ start_urls, stop_urls })
  const queue = new PQueue({concurrency})

  let urls = []
  if (start_urls.length) {
    start_urls.forEach(u => {
      if (typeof u === 'string') {
        urls.push(u)
      } else if (u && typeof (<any>u).url === 'string') {
        urls.push((<any>u).url)
      }
    })
  }

  await queue.addAll(
    sitemap_urls.map(url => {
      return async () => {
        const urlList = (await parseSitemap(url)).filter(sitemapUrl => {
          return sitemap_urls_patterns.some(p => match(p, sitemapUrl))
        })
        urls = urls.concat(urlList)
      }
    })
  )

  urls = uniq(urls)
  if (!force_sitemap_urls_crawling) {
    urls = urls.filter(check)
  }
  debug('sitemap urls:', urls)

  return urls
}

export default async function wowsearch(config: Config): Promise<{}> {
  config = normalize(config)
  const { concurrency } = config

  debug('Config: %O', config)

  const docMap = {}
  const urls = await getUrlList(config)
  const queue = new PQueue({concurrency})
  const history = new Map()
  let browser
  if (config.js_render) {
    browser = await createBrowser(config.timeout)
  }

  const createTask = (url) => {
    return async () => {
      if (history.has(url)) return
      history.set(url, true)
      const { documentNode, smartCrawlingUrls } = await crawlByUrl(url, config, browser)
      if (!documentNode) return
      docMap[url] = documentNode
      debug('Done crawl page: %s, smartCrawlingUrls: %O', url, smartCrawlingUrls)

      if (smartCrawlingUrls && smartCrawlingUrls.length) {
        const notWalkedUrls = smartCrawlingUrls.filter(
          smartUrl => !history.has(smartUrl)
        )
        // const innerLimit = pLimit(concurrency)

        queue.addAll(notWalkedUrls.map(url => createTask(url)))
      }
    }
  }

  await queue.addAll(urls.map(url => createTask(url)))
  await queue.onIdle()
  browser && await browser.close()
  debug('Start pushing')
  return await pushDocumentNodeMap(docMap, config)
}
