import { CrawlerConfig, StrictSelector } from './types/Config'
import {func} from "prop-types";

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

  let nodes = []
  if (selectorItem.selector) {
    if (selectorItem.type === 'css' || !selectorItem.type) {
      nodes = [].slice.apply(document.querySelectorAll(selectorItem.selector))
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
      while (thisHeading) {
        selfNode.contains(thisHeading) && nodes.push(thisHeading)
        thisHeading = headings.iterateNext()
      }
    }
  }

  nodes && debug('selector: %s, matched nodes: %o.', selectorItem.selector, nodes.map(node => node.textContent))

  return nodes
}

export function selectOne(document, selectorItem): Element {
  selectorItem = normalizeSelector(selectorItem)
  if (!selectorItem) return null

  let node = null
  if (selectorItem.selector) {
    if (selectorItem.type === 'css' || !selectorItem.type) {
      node = document.querySelector(selectorItem.selector)
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
          node =  thisHeading
          break
        }
        thisHeading = headings.iterateNext()
      }
    }
  }

  node && debug('selector: %s, matched: %o.', selectorItem.selector, node.textContent)

  return node
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
  }

  return {
    node,
    text: text && transformText(text, selectorItem)
  }
}

function transformText(text, selectorItem) {
  let strip_chars = selectorItem.strip_chars || ''
  return text
    ? text.replace(
      new RegExp(`(^[${strip_chars}]+)|(${strip_chars}]+$)`, 'g'),
      ''
    )
    : selectorItem.hasOwnProperty('default_value')
      ? selectorItem.default_value
      : null
}

export function selectAllVal(
  selectorItem,
  document
): { nodes: Node[], texts: string[] } {
  selectorItem = normalizeSelector(selectorItem)

  let nodes = selectAll(document, selectorItem)

  return {
    nodes,
    texts: nodes.map(node => transformText(node.textContent, selectorItem))
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
