import * as uniq from 'lodash.uniq'
import * as each from 'lodash.foreach'

import {Config, CrawlerConfig, Selectors, Selector, StrictSelector} from './types/Config'
import selectVal, {
  normalizeSelector,
  selectAll,
  selectOne,
  transformVal
} from './selectVal'
import DocumentNode from './types/DocumentNode'
import LvlNode from './types/LvlNode'
import TextNode from './types/TextNode'

export function parseLvlTypeLevel(type: string): number {
  type = type.trim()
  if (/^lvl([\d+])$/.test(type)) {
    return Number(RegExp.$1)
  }
  return null
}

export function isLvlType(type: string): boolean {
  return parseLvlTypeLevel(type) !== null
}

export const LVL_TYPES = [
  'lvl0',
  'lvl1',
  'lvl2',
  'lvl3',
  'lvl4',
  'lvl5',
  'lvl6'
]

function matchSelector(
  node: Node,
  selectorList: Selector[]
): { node: Node; selector: Selector; selectorIndex: number } | null {
  let selectorNode = node
  let selectorIndex = selectorList.findIndex(s => {
    s = normalizeSelector(s)
    if (s.type === 'css') {
      if (typeof (node as Element).matches === 'function' && (node as Element).matches(s.selector)) {
        selectorNode = node
        return true
      }
      selectorNode = selectOne(node, s)
      return !!selectorNode
    }
    else {
      selectorNode = selectOne(node, s, {xpathRoot: node})
      return !!selectorNode
    }
  })

  if (selectorIndex >= 0) {
    return {
      selector: selectorList[selectorIndex],
      selectorIndex,
      node: selectorNode
    }
  }

  return null
}

function generateTextNode(node: Node, selector: StrictSelector) {
  return new TextNode(transformVal(node.textContent, selector))
}

function generateLvlNode(
  selectorKey,
  document: Element,
  selectors: Selectors
): LvlNode {
  const selectorItem = normalizeSelector(selectors[selectorKey])
  if (!selectorItem) return null

  const nodeList = selectAll(document, selectorItem)
  if (!nodeList.length) return null

  const level = parseLvlTypeLevel(selectorKey)
  if (level === null) {
    // new TextNode(transformVal(current.textContent, selectorItem))
    return null
  }

  const lvlNode = new LvlNode(level)
  const selectorKeys = uniq(LVL_TYPES.concat(Object.keys(selectors)))
  const current = nodeList[0]
  lvlNode.value = transformVal(current.textContent, selectorItem)

  selectorItem.anchor_selector = selectorItem.anchor_selector || 'a[id]'
  lvlNode.anchor = current.getAttribute('id')
  if (!lvlNode.anchor) {
    let tmpNode = selectOne(current, selectorItem.anchor_selector, {xpathRoot: current})
    if (tmpNode) {
      lvlNode.anchor = tmpNode.getAttribute('id')
    }
  }
  const children = lvlNode.children

  const index = selectorKeys.indexOf(selectorKey)
  // const higherSelectorList = selectorKeys
  //   .slice(0, index)
  //   .map(key => selectors[key])
  //   .filter(Boolean)
  const lowerSelectorKeys = selectorKeys
    .slice(index + 1)
    .filter(key => selectors[key])
  const lowerSelectorList = lowerSelectorKeys.map(key => selectors[key])

  let nextSibling = current.nextElementSibling
  while (nextSibling) {
    const curr = nextSibling
    nextSibling = nextSibling.nextElementSibling
    let matches
    if ((matches = matchSelector(curr, lowerSelectorList))) {
      matches.node.remove()

      const matchedSelectorKey = lowerSelectorKeys[matches.selectorIndex]
      if (isLvlType(matchedSelectorKey)) {
        let childNode = generateLvlNode(matchedSelectorKey, document, selectors)
        childNode && children.push(childNode)
      } else {
        children.push(
          generateTextNode(matches.node, matches.selector)
        )
      }
      // children.push(new )
    }
  }

  for (let i = 1; i < nodeList.length; i++) {
    const nextLvl = nodeList[i]
  }
  // lvlNode.value =

  return lvlNode
}

export default function parseElementTree(
  document: Element,
  selectors: Selectors
): DocumentNode {
  const documentNode = new DocumentNode()
  const selectorKeys = uniq(LVL_TYPES.concat(Object.keys(selectors)))

  selectorKeys.forEach(selectorKey => {
    const selectorItem = normalizeSelector(selectors[selectorKey])
    if (!selectorItem) return

    if (selectorItem.global) {
      documentNode.global.set(
        selectorKey,
        selectVal(selectorItem, document).text
      )
    } else {
      if (isLvlType(selectorKey)) {
        const lvlNode = generateLvlNode(selectorKey, document, selectors)
        lvlNode && documentNode.children.push(lvlNode)
      } else {
        // selectOne()
        // const lvlNode = generateTextNode(selectorKey, document, selectors)
      }

      // const nodeList = selectAll(document, selectorItem)
      // console.log(selectorKey, nodeList)
    }
  })

  return documentNode
}
