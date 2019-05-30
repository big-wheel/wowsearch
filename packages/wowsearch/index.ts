/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { Config, normalize } from './src/types/Config'
import { crawl, crawlByUrl } from './src/crawl'
import match, { isRule, Rule } from './src/match'
import parse from './src/parseSitemap'
const debug = require('debug')('wowsearch')

import * as preduce from 'p-reduce'
import * as uniq from 'lodash.uniq'
import makeCheck from './src/makeCheckUrl'

export async function getUrlList(config: Config) {
  const {
    start_urls,
    stop_urls,
    smart_crawling,
    force_crawling_urls,
    sitemap_urls,
    sitemap_urls_patterns,
    force_sitemap_urls_crawling
  } = config
  const check = makeCheck({ start_urls, stop_urls })

  let urls = []
  if (start_urls.length) {
    start_urls.forEach(u => {
      if (typeof u === 'string') {
        urls.push(u)
      }
      else if (u && typeof (<any>u).url === 'string') {
        urls.push((<any>u).url)
      }
    })
  }

  if (sitemap_urls.length) {
    urls = urls.concat(
      await preduce(
        sitemap_urls,
        async (urls, url) => {
          return urls.concat(
            (await parse(url)).filter(sitemapUrl => {
              return sitemap_urls_patterns.some(p => match(p, sitemapUrl))
            })
          )
        },
        []
      )
    )
    urls = uniq(urls)
    if (!force_sitemap_urls_crawling) {
      urls = urls.filter(check)
    }
    debug('sitemap filled urls:', urls)
  }
  urls = uniq(urls)

  return urls
}

export default async function wowsearch(config: Config) {
  config = normalize(config)

  const urls = await getUrlList(config)

  const history = []
  while (!!urls.length) {
    const url = urls.shift()
    history.push(url)
    const { crawlTexts, smartCrawlingUrls } = await crawlByUrl(url, config)
    if (crawlTexts) {
      console.log(crawlTexts)
    }

    if (smartCrawlingUrls) {
      const notWalkedUrls = smartCrawlingUrls.filter(smartUrl => history.indexOf(smartUrl) < 0)
      urls.push(...notWalkedUrls)
    }
  }
}
