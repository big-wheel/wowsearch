import { isRule, Rule } from 'wowsearch-parse/dist/match'
import match from 'wowsearch-parse/dist/match'

/**
 * @file makeCheckUrl
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */

export function makeIsInStartUrls(start_urls) {
  return function isInStartUrls(url) {
    return start_urls.some(rule => {
      if (isRule(rule)) {
        return match(<Rule>rule, url)
      }
      return match((<any>rule).url, url)
    })
  }
}

export default function check(start_urls = [], stop_urls = []) {
  const isInStartUrls = makeIsInStartUrls(start_urls)
  const isInStopUrls = makeIsInStopUrls(stop_urls)
  return function check(url) {
    return isInStartUrls(url) && !isInStopUrls(url)
  }
}

export function makeIsInStopUrls(stop_urls) {
  return function isInStopUrls(url) {
    return stop_urls.some(rule => {
      return match(<Rule>rule, url)
    })
  }
}
