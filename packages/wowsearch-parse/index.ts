import * as uniq from 'lodash.uniq'
import * as visitTree from '@moyuyc/visit-tree'

import {
  Config,
  CrawlerConfig,
  Selectors,
  Selector,
  StrictSelector
} from './types/Config'
import selectVal, {
  normalizeSelector,
  selectAll,
  selectAllVal,
  selectOne,
  transformVal
} from './selectVal'
import DocumentNode from './types/DocumentNode'
import LvlNode from './types/LvlNode'
import TextNode from './types/TextNode'

export function parseLvlTypeLevel(type: string = ''): number {
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
  'lvl6',
  'lvl7',
  'lvl8',
  'lvl9'
]

function matchSelector(
  node: Element,
  selectorList: Selector[]
): { node: Element; selector: Selector; selectorIndex: number } | null {
  let selectorNode = node
  let selectorIndex = selectorList.findIndex(s => {
    s = normalizeSelector(s)
    if (s.type === 'css') {
      if (typeof node.matches === 'function' && node.matches(s.selector)) {
        selectorNode = node
        return true
      }
      selectorNode = selectOne(node, s)
      return !!selectorNode
    } else {
      selectorNode = selectOne(node, s)
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

function getAnchor(elem: Element, selectorItem: StrictSelector) {
  const {
    anchor_selector = 'a[id]',
    anchor_attribute_name = 'id'
  } = selectorItem
  if (!anchor_attribute_name) return

  let anchor = elem.getAttribute(anchor_attribute_name)
  if (!anchor) {
    let tmpNode = anchor_selector && selectOne(elem, anchor_selector)
    if (tmpNode) {
      return tmpNode.getAttribute(anchor_attribute_name)
    }
  }
  return anchor
}

function generateTextNode(node: Node, selector: StrictSelector, allowInnerText: boolean) {
  // @ts-ignore
  const textNode = new TextNode(transformVal(allowInnerText ? (node.innerText || node.textContent) : node.textContent, selector))
  textNode.domNode = node
  return textNode
}

// todo:
// 1. walk document by pre order
// 2. find node which matches one of selectors
function generateLvlNode(
  selectorKey,
  startElem: Element,
  selectors: Selectors,
  walk?: Function,
  allowInnerText?: boolean
): { lvlNode: LvlNode; endElement: Element } {
  const selectorItem = normalizeSelector(selectors[selectorKey])
  if (!selectorItem) return null
  const level = parseLvlTypeLevel(selectorKey)
  if (level === null) {
    // new TextNode(transformVal(current.textContent, selectorItem))
    return null
  }

  const selectorKeys = uniq(LVL_TYPES.concat(Object.keys(selectors)))
  const selectorEntryList = selectorKeys
    .map(key => ({ key, selector: selectors[key] }))
    .filter(({ selector }) => selector)
  const selectorList = selectorEntryList.map(({ selector }) => selector)
  const lvlNode = new LvlNode(level)

  walk && walk(startElem)
  lvlNode.domNode = startElem
  // @ts-ignore
  lvlNode.value = transformVal(allowInnerText ? (startElem.innerText || startElem.textContent) : startElem.textContent, selectorItem)
  lvlNode.anchor = getAnchor(startElem, selectorItem)
  const children = lvlNode.children

  let callbackList = []
  let curr = startElem.nextElementSibling
  while (curr) {
    let isBreak
    let isContinue

    runUntilEq(current => {
      let matches
      if ((matches = matchSelector(current, selectorList))) {
        const matchedSelectorKey =
          selectorEntryList[matches.selectorIndex] &&
          selectorEntryList[matches.selectorIndex].key
        if (isLvlType(matchedSelectorKey)) {
          if (level < parseLvlTypeLevel(matchedSelectorKey)) {
            // callbackList.forEach(fn => fn())
            // callbackList = []

            const childObj = generateLvlNode(
              matchedSelectorKey,
              matches.node,
              selectors,
              walk,
              allowInnerText
            )
            children.push(childObj.lvlNode)
            // matches.node.remove()
            curr = childObj.endElement
            isContinue = true
            return
            // return matches.node
          } else {
            isBreak = true
            return
            // return matches.node
          }
        } else if (matchedSelectorKey === 'text') {
          walk && walk(matches.node)
          const node = generateTextNode(matches.node, matches.selector, allowInnerText)
          node && node.value && children.push(node)
          callbackList.push(() => {
            matches.node.remove()
          })
        }

        return matches.node
      }
    }, curr)

    if (isBreak) {
      break
    }
    if (isContinue) {
      continue
    }

    // curr && curr.remove()
    curr = curr && curr.nextElementSibling
  }

  callbackList.forEach(fn => fn())

  return {
    lvlNode,
    endElement: curr
  }
}

function runUntilEq(walk, node: Element) {
  let next = walk(node)
  // node.remove && node.remove()

  while (next && next !== node) {
    next.remove()
    // node = next
    next = walk(node)
  }
}

export default function parseElementTree(
  document: Element,
  selectors: Selectors,
  { allowInnerText = false }: {
    allowInnerText?: boolean
  } = {}
): DocumentNode {
  const documentNode = new DocumentNode()
  const selectorKeys = uniq(LVL_TYPES.concat(Object.keys(selectors)))

  // Deals with global selector
  selectorKeys.forEach(selectorKey => {
    const selectorItem = normalizeSelector(selectors[selectorKey])
    if (!selectorItem) return

    if (selectorItem.global) {
      documentNode.global.set(
        selectorKey,
        selectorItem.multiple
          ? selectAllVal(selectorItem, document).texts
          : selectVal(selectorItem, document).text
      )
    }
  })

  const selectorList = selectorKeys
    .map(key => ({
      key,
      selector: normalizeSelector(selectors[key])
    }))
    .filter(({ selector }) => selector && !selector.global)
  const selectorListPure = selectorList.map(({ selector }) => selector)

  const track = new WeakMap()
  visitTree(
    document,
    (childNode: Element, ctx) => {
      // Removed or walked
      if (track.has(childNode) || !childNode.parentElement) {
        return ctx.skip()
      }

      const matched = matchSelector(childNode, selectorListPure)
      if (matched) {
        if (matched.selector) {
          const matchedNode = matched.node
          if (track.has(matchedNode)) {
            return
          }

          const { selector, key } = selectorList[matched.selectorIndex]
          if (selector.type) {
            if (key === 'text') {
              const node = generateTextNode(matchedNode, selector, allowInnerText)
              node && node.value && documentNode.children.push(node)
              // ctx.skip()
            } else if (isLvlType(key)) {
              const { lvlNode, endElement } = generateLvlNode(
                key,
                matchedNode,
                selectors,
                elem => {
                  track.set(elem, true)
                },
                allowInnerText
              )
              documentNode.children.push(lvlNode)
              // ctx.skip()
            }
          }
        }
        ctx.node.remove()
        return matched.node.remove()
      } else {
        // ctx.skip()
        // childNode.remove && childNode.remove()
      }
    },
    () => {},
    { path: 'children' }
  )

  return documentNode
}
