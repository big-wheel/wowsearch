import { CrawlerConfig, StrictSelector } from './types/Config'

const debug = require('debug')('wowsearch:select')

export function normalizeSelector(selectorItem): StrictSelector {
  if (typeof selectorItem === 'string') {
    selectorItem = {
      type: 'css',
      selector: selectorItem
    }
  }

  return selectorItem
}

export function selectAll(
  document,
  selectorItem,
): Element[] {
  selectorItem = normalizeSelector(selectorItem)
  if (!selectorItem) return []

  if (selectorItem.selector) {
    if (selectorItem.type === 'css' || !selectorItem.type) {
      return [].slice.apply(document.querySelectorAll(selectorItem.selector))
    } else {
      const documentElem = document.ownerDocument || document
      const selfNode = document
      const headings = documentElem.evaluate(
        selectorItem.selector,
        selfNode,
        null,
        0,
        null
      )
      let thisHeading = headings.iterateNext()
      const array = []
      while (thisHeading) {
        selfNode.contains(thisHeading) && array.push(thisHeading)
        thisHeading = headings.iterateNext()
      }
      return array
    }
  }

  return []
}

export function selectOne(document, selectorItem): Element {
  selectorItem = normalizeSelector(selectorItem)
  if (!selectorItem) return null

  if (selectorItem.selector) {
    if (selectorItem.type === 'css' || !selectorItem.type) {
      return document.querySelector(selectorItem.selector)
    } else {
      const documentElem = document.ownerDocument || document
      const selfNode = document
      const headings = documentElem.evaluate(
        selectorItem.selector,
        selfNode,
        null,
        0
      )
      let thisHeading = headings.iterateNext()
      while (thisHeading) {
        if (selfNode.contains(thisHeading)) {
          return thisHeading
        }
        thisHeading = headings.iterateNext()
      }
    }
  }

  return null
}

export default function selectVal(
  selectorItem,
  document
): { node: Node; text: string } {
  selectorItem = normalizeSelector(selectorItem)

  let text = null
  let node = selectOne(document, selectorItem)
  if (node) {
    text = node.textContent
    debug('selector: %s, matched: %o.', selectorItem.selector, text)
  }

  let strip_chars = selectorItem.strip_chars || ''
  text = text
    ? text.replace(
        new RegExp(`(^[${strip_chars}]+)|(${strip_chars}]+$)`, 'g'),
        ''
      )
    : selectorItem.hasOwnProperty('default_value')
      ? selectorItem.default_value
      : null

  return {
    node,
    text
  }
}

export function stripChars(
  selectorItem,
  document
): { node: Node; text: string } {
  selectorItem = normalizeSelector(selectorItem)

  let text = null
  let node = selectOne(document, selectorItem)
  if (node) {
    text = node.textContent
    debug('selector: %s, matched: %o.', selectorItem.selector, text)
  }

  return {
    node,
    text: transformVal(text, selectorItem)
  }
}

export function transformVal(text: string, selectorItem): string {
  selectorItem = normalizeSelector(selectorItem)

  let strip_chars = selectorItem.strip_chars || ''
  text = text
    ? text.replace(
        new RegExp(`(^[${strip_chars}]+)|(${strip_chars}]+$)`, 'g'),
        ''
      )
    : selectorItem.hasOwnProperty('default_value')
      ? selectorItem.default_value
      : null

  return text
}
