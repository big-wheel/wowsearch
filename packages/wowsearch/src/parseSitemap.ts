/**
 * @file parseSitemap
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as fetch from 'got'
import { parseString } from 'xml2js'
import * as pify from 'pify'
import * as uniq from 'lodash.uniq'
const debug = require('debug')('wowsearch:sitemap')

export function parseSitemapXML(text: string): Promise<any> {
  return pify(parseString)(text)
}

export function parseSitemapTXT(text: string): string[] {
  return text
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
}

export default async function parseFromUrl(url: string) {
  debug('fetching %s', url)
  const res = await fetch(encodeURI(url))
  const text = await res.body
  if (
    res.headers.get('content-type') === 'application/xml' ||
    url.toLowerCase().endsWith('.xml')
  ) {
    let obj = await parseSitemapXML(text)
    let urls = []
    obj.urlset.url.forEach(({ loc }) => {
      if (Array.isArray(loc)) {
        urls.push(...loc)
      } else {
        urls.push(loc)
      }
    })
    return uniq(urls)
  }
  return parseSitemapTXT(text)
}
