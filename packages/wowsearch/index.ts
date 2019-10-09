/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import {
  Config,
  MatchedUrlEntity,
  normalize
} from 'wowsearch-parse/dist/types/Config'
import {
  crawl,
  crawlByUrl,
  pushDocumentNode,
  createBrowser,
  pushDocumentNodeMap, createGetLivingBrowser
} from './src/crawl'
import match, { isRule, Rule } from 'wowsearch-parse/dist/match'
import parseSitemap from './src/parseSitemap'
const debug = require('debug')('wowsearch')
const smartDebug = require('debug')('wowsearch:smart')

import PQueue from 'p-queue'
import * as uniq from 'lodash.uniq'
import makeCheck from './src/makeCheckUrl'

export async function getUrlList(
  config: Config
): Promise<Array<MatchedUrlEntity>> {
  const {
    concurrency = 1,
    start_urls,
    start_urls_patterns,
    stop_urls_patterns,
    smart_crawling,
    sitemap_urls
  } = config
  const check = makeCheck(start_urls_patterns, stop_urls_patterns)
  const queue = new PQueue({ concurrency })

  let urls = []
  if (start_urls && start_urls.length) {
    start_urls.forEach(u => {
      if (typeof u === 'string') {
        urls.push(u)
      }
    })
  }

  await queue.addAll(
    sitemap_urls.map(url => {
      return async () => {
        const urlList = await parseSitemap(url)
        urls = urls.concat(urlList)
      }
    })
  )

  urls = uniq(urls)
  urls = urls
    .map(url => {
      const rule = check(url)
      if (rule) {
        return {
          url,
          rule
        }
      }
      return null
    })
    .filter(Boolean)
  debug('sitemap urls:', urls.map(u => u.url))

  return urls
}

export default async function wowsearch(config: Config): Promise<{}> {
  config = normalize(config)
  const { concurrency = 1 } = config

  debug('Config: %O', config)

  const docMap = {}
  const urls = await getUrlList(config)
  const queue = new PQueue({ concurrency })
  const history = new Map<string, any>()
  let getBrowser
  if (config.js_render) {
    getBrowser = await createGetLivingBrowser(config.timeout)
  }

  const createTask = (ent: MatchedUrlEntity) => {
    const { url, rule } = ent
    return async () => {
      if (history.has(url)) return
      history.set(url, true)
      const { documentNode, smartCrawlingUrls } = await crawlByUrl(
        url,
        config,
        getBrowser
      )
      if (documentNode) {
        documentNode.urlRule = rule
        docMap[url] = documentNode
      }

      if (smartCrawlingUrls && smartCrawlingUrls.length) {
        const notWalkedUrls = smartCrawlingUrls.filter(
          ({ url }) => !history.has(url)
        )
        smartDebug('notWalkedUrls: %O from %s', notWalkedUrls, url)
        queue.addAll(notWalkedUrls.map(ent => createTask(ent)))
      }

      debug(
        'Done crawl page: %s, left %s tasks',
        url,
        // except self
        queue.size + queue.pending - 1
      )
    }
  }

  await queue.addAll(urls.map(url => createTask(url)))
  await queue.onIdle()
  !process.env['WOWSEARCH_NO_BROWSER_CLOSE'] && getBrowser && (await getBrowser().close())
  debug('Start pushing')
  return await pushDocumentNodeMap(docMap, config)
}
