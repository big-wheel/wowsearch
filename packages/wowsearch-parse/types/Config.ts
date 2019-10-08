/**
 * @file Config
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as w from 'walli'
import * as each from 'lodash.foreach'
import * as clone from 'lodash.clonedeep'
import { cpus } from 'os'
import { Rule, walliRule } from '../match'
import { normalizeSelector } from '../selectVal'

type CommonConfig = {
  strip_chars?: string
  anchor_attribute_name?: string
  anchor_selector?: Selector
}

export type MatchedUrlEntity = {
  url: string
  rule: Rule
}

export type Selector = string | StrictSelector

export type StrictSelector = CommonConfig & {
  selector: string
  type?: 'xpath' | 'css'
  global?: boolean
  anchor_attribute_name?: string
  multiple?: boolean
  anchor_selector?: AnchorSelector | string
  default_value?: any
}

export type AnchorSelector = CommonConfig & {
  selector: string
  type?: 'xpath' | 'css'
  global?: boolean
  default_value?: any
}

const walliSelector = w.oneOf([
  w.string,
  w.leq({
    selector: w.string,
    type: w.oneOf(['xpath', 'css']).optional,
    default_value: w.any.optional,
    strip_chars: w.string.optional
  })
])

export type Selectors = {
  lvl0?: Selector
  lvl1?: Selector
  lvl2?: Selector
  lvl3?: Selector
  lvl4?: Selector
  lvl5?: Selector
  lvl6?: Selector
  text?: Selector
}

export type CrawlerConfig = CommonConfig & {
  concurrency?: number
  timeout?: number
  request_headers?: {}
  request_cookie?: string
  js_render?: boolean
  js_waitfor?: string | number | Function
  start_urls?: Array<string>
  start_urls_patterns?: Array<Rule>
  stop_urls_patterns?: Array<Rule>
  selectors: Selectors

  source_adaptor?: {
    name: string
    options?: any
  }

  selectors_exclude?: string[]
  smart_crawling?: boolean
  smart_crawling_selector?: Selector
  force_crawling_urls?: boolean
}

export type Config = CrawlerConfig & {
  sitemap_urls?: string[]
}

const WalliDef = w.leq({
  concurrency: w.number.optional,
  timeout: w.number.optional,
  js_render: w.boolean.optional,
  js_waitfor: w.oneOf([w.string, w.number, w.function_]).optional,
  strip_chars: w.string.optional,
  request_cookie: w.string.optional,
  request_headers: w.object.optional,
  source_adaptor: w.leq({
    name: w.string,
    options: w.any.optional
  }),
  smart_crawling: w.boolean.optional,
  smart_crawling_selector: walliSelector.optional,
  start_urls: w.arrayOf(w.string).optional,
  start_urls_patterns: w.arrayOf(w.oneOf([walliRule, w.leq({ url: w.string })]))
    .optional,
  stop_urls_patterns: w.arrayOf(w.oneOf([walliRule, w.leq({ url: w.string })]))
    .optional,
  stop_urls: w.arrayOf(w.string).optional,

  selectors: {
    lvl0: walliSelector.optional,
    lvl1: walliSelector.optional,
    lvl2: walliSelector.optional,
    lvl3: walliSelector.optional,
    lvl4: walliSelector.optional,
    lvl5: walliSelector.optional,
    lvl6: walliSelector.optional,
    text: walliSelector.optional
  },

  selectors_exclude: w.arrayOf(walliSelector).optional
})

export function normalize(config: Config) {
  let errorMsg = WalliDef.toUnlawfulString(config)
  if (errorMsg) {
    throw new TypeError(errorMsg)
  }
  config = clone(config)

  config = Object.assign(
    {
      concurrency: Math.max(cpus().length - 1, 1),
      timeout: 30000,
      strip_chars: ' .,;:§¶',
      js_render: false,
      js_waitfor: 0,
      anchor_selector: 'a[id]',
      anchor_attribute_name: 'id',
      start_urls: [],
      start_urls_patterns: [/.*/],
      stop_urls_patterns: [],
      selectors_exclude: [],
      sitemap_urls: [],
      smart_crawling: false,
      smart_crawling_selector: 'a[href]',
      force_crawling_urls: false
    },
    config
  )

  each(config.selectors, (value, key) => {
    if (typeof value === 'string') {
      value = {
        selector: value
      }
    }
    if (value) {
      config.selectors[key] = Object.assign(
        {
          type: 'css',
          strip_chars: config.strip_chars,
          anchor_selector: config.anchor_selector,
          anchor_attribute_name: config.anchor_attribute_name,
          default_value: null
        },
        value
      )
      config.selectors[key].anchor_selector = normalizeSelector(
        config.selectors[key].anchor_selector
      )
    }
  })
  config.smart_crawling_selector = normalizeSelector(
    config.smart_crawling_selector
  )

  return config
}
