/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { Config, normalize } from 'wowsearch-parse/types/Config'
import { crawl, crawlByUrl } from './src/crawl'
import match, { isRule, Rule } from 'wowsearch-parse/match'
import parseSitemap from './src/parseSitemap'
const debug = require('debug')('wowsearch')

import pLimit from 'p-limit'
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
  const limit = pLimit(concurrency)

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

  await Promise.all(
    sitemap_urls.map(url => {
      return limit(async () => {
        const urlList = (await parseSitemap(url)).filter(sitemapUrl => {
          return sitemap_urls_patterns.some(p => match(p, sitemapUrl))
        })
        urls = urls.concat(urlList)
      })
    })
  )

  urls = uniq(urls)
  if (!force_sitemap_urls_crawling) {
    urls = urls.filter(check)
  }
  debug('sitemap filled urls:', urls)

  return urls
}

export default async function wowsearch(config: Config): Promise<{}> {
  config = normalize(config)
  const { concurrency } = config

  const docMap = {}
  const urls = await getUrlList(config)
  const limit = pLimit(concurrency)

  const history = new Map()
  const createTask = (url, limit) => {
    return limit(async () => {
      history.set(url, true)
      const { documentNode, smartCrawlingUrls } = await crawlByUrl(url, config)
      if (!documentNode) return
      docMap[url] = documentNode

      if (smartCrawlingUrls && smartCrawlingUrls.length) {
        const notWalkedUrls = smartCrawlingUrls.filter(
          smartUrl => !history.has(smartUrl)
        )

        const innerLimit = pLimit(concurrency)
        return Promise.all(
          notWalkedUrls.map(url => {
            return createTask(url, innerLimit)
          })
        )
      }
    })
  }

  await Promise.all(urls.map(url => createTask(url, limit)))

  return docMap
}
