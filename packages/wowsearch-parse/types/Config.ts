/**
 * @file Config
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as w from 'walli'
import * as each from 'lodash.foreach'
import * as clone from 'lodash.clonedeep'
import { Rule, walliRule } from '../match'
import { normalizeSelector } from '../selectVal'

type CommonConfig = {
  strip_chars?: string
  anchor_attribute_name?: string
  anchor_selector?: Selector
}

export type Selector = string | StrictSelector

export type StrictSelector = CommonConfig & {
  selector: string
  type?: 'xpath' | 'css'
  global?: boolean
  anchor_attribute_name?: string
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
  js_render?: boolean
  js_waitfor?: string | number | Function
  start_urls?: Array<Rule | { url: Rule }>
  stop_urls?: Rule[]

  selectors: Selectors

  selectors_exclude?: string[]
  smart_crawling?: boolean
  force_crawling_urls?: boolean
}

export type Config = CrawlerConfig & {
  sitemap_urls?: string[]
  sitemap_urls_patterns?: Rule[]
  force_sitemap_urls_crawling?: boolean
}

const WalliDef = w.leq({
  js_render: w.boolean.optional,
  js_waitfor: w.oneOf([w.string, w.number, w.function_]).optional,
  strip_chars: w.string.optional,
  start_urls: w.arrayOf(w.oneOf([walliRule, w.leq({ url: w.string })]))
    .optional,
  stop_urls: w.arrayOf(walliRule).optional,

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

  selectors_exclude: w.arrayOf(w.string).optional
})

export function normalize(config: Config) {
  let errorMsg = WalliDef.toUnlawfulString(config)
  if (errorMsg) {
    throw new TypeError(errorMsg)
  }
  config = clone(config)

  config = Object.assign(
    {
      strip_chars: ' .,;:§¶',
      js_render: false,
      js_waitfor: 0,
      anchor_selector: 'a[id]',
      anchor_attribute_name: 'id',
      start_urls: [/.*/],
      stop_urls: [],
      selectors_exclude: [],
      sitemap_urls: [],
      sitemap_urls_patterns: [/.*/],
      force_sitemap_urls_crawling: false,
      smart_crawling: false,
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

  return config
}
