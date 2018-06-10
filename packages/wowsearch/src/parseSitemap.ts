/**
 * @file parseSitemap
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as request from 'request-promise-native'
import { parseString } from 'xml2js'
import * as pify from 'pify'
import * as uniq from 'array-uniq'

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
  const text = await request(url)
  if (url.toLowerCase().endsWith('.xml')) {
    let obj = await parseSitemapXML(text)
    let urls = []
    obj.urlset.url.forEach(({ loc }) => {
      if (Array.isArray(loc)) {
        urls.push(...loc)
      }
      else {
        urls.push(loc)
      }
    })
    return uniq(urls)
  }
  return parseSitemapTXT(text)
}
