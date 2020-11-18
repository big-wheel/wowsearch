import * as uniq from "lodash.uniq";
import * as visitTree from "@moyuyc/visit-tree";

import {
  Selectors,
  Selector,
  StrictSelector
} from "./types/Config";
import selectVal, {
  normalizeSelector,
  selectAll,
  selectAllVal,
  selectOne,
  transformVal
} from "./selectVal";
import DocumentNode from "./types/DocumentNode";
import LvlNode from "./types/LvlNode";
import TextNode from "./types/TextNode";

export function parseLvlTypeLevel(type: string = ""): number {
  type = type.trim();
  if (/^lvl([\d+])$/.test(type)) {
    return Number(RegExp.$1);
  }
  return null;
}

export function isLvlType(type: string): boolean {
  return parseLvlTypeLevel(type) !== null;
}

export const LVL_TYPES = [
  "lvl0",
  "lvl1",
  "lvl2",
  "lvl3",
  "lvl4",
  "lvl5",
  "lvl6",
  "lvl7",
  "lvl8",
  "lvl9"
];

function matchSelector(
  node: Element,
  selectorList: Selector[]
): { node: Element; selector: Selector; selectorIndex: number } | null {
  let selectorNode = node;
  let selectorIndex = selectorList.findIndex(s => {
    s = normalizeSelector(s);
    if (s.type === "css") {
      if (typeof node.matches === "function" && node.matches(s.selector)) {
        selectorNode = node;
        return true;
      }
      // selectorNode = selectOne(node, s)
      // return !!selectorNode
    } else {
      selectorNode = selectOne(node, s);
      return !!selectorNode;
    }
  });

  if (selectorIndex >= 0) {
    return {
      selector: selectorList[selectorIndex],
      selectorIndex,
      node: selectorNode
    };
  }

  return null;
}

function getAnchor(elem: Element, selectorItem: StrictSelector) {
  const {
    anchor_selector = "a[id]",
    anchor_attribute_name = "id"
  } = selectorItem;
  if (!anchor_attribute_name) return;

  let anchor = elem.getAttribute(anchor_attribute_name);
  if (!anchor) {
    let tmpNode = anchor_selector && selectOne(elem, anchor_selector);
    if (tmpNode) {
      return tmpNode.getAttribute(anchor_attribute_name);
    }
  }
  return anchor;
}

function generateTextNode(
  node: Node,
  selector: StrictSelector,
  { transformNode, type = "text", allowInnerText }: any = {}
) {
  const textNode = new TextNode(
    transformVal(
      // @ts-ignore
      allowInnerText ? node.innerText || node.textContent : node.textContent,
      selector
    )
  );
  textNode.type = type;
  textNode.domNode = node;
  if (typeof transformNode === "function") {
    return transformNode(textNode);
  }
  return textNode;
}

function runUntilEq(walk, node: Element) {
  let next = walk(node);
  // node.remove && node.remove()

  while (next && next !== node) {
    next.remove();
    // node = next
    next = walk(node);
  }
}

function parseLvlChildren(
  startElem: Element,
  selectors: Selectors,
  parent: LvlNode,
  { allowInnerText, transformNode, __cache }: any
) {
  let children = [];
  const elements = parseElements(startElem, selectors, {
    allowInnerText,
    transformNode,
    __cache
  });

  const getLastElem = (elements) => {
    if (!Array.isArray(elements)) {
      elements = [elements]
    }

    if (elements.length) {
      const last: any = elements[elements.length - 1]
      return last.children && last.children.length ? getLastElem(last.children[last.children.length - 1]) : last.domNode
    }
  }

  let endElem = getLastElem(elements)

  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i];
    if (elem.type === "lvl") {
      if ((elem as LvlNode).level <= parent.level) {

        console.log(endElem.outerHTML, startElem.outerHTML, elements)
        return {
          endElement: endElem,
          nextElements: elements.slice(i),
          children
        };
      }
    }
    children.push(elem);
  }

  if (startElem.nextElementSibling) {
    const nextResult = parseLvlChildren(
      startElem.nextElementSibling,
      selectors,
      parent,
      { allowInnerText, transformNode, __cache }
    );
    children = children.concat(nextResult.children);

    // console.log(startElem, endElem, nextResult)
    return {
      endElement: nextResult.endElement,
      nextElements: nextResult.nextElements,
      children
    };
  }

  return {
    endElement: endElem || startElem,
    nextElements: [],
    children
  };
}

export function parseElements(
  document: Element,
  selectors: Selectors,
  {
    allowInnerText = false,
    transformNode,
    __cache = new Map()
  }: {
    allowInnerText?: boolean;
    transformNode?: (node: any) => any;
    __cache?: Map<Element, boolean>
  } = {}
): Array<LvlNode | TextNode> {
  let contents: Array<LvlNode | TextNode> = [];

  const selectorKeys = uniq(LVL_TYPES.concat(Object.keys(selectors)));
  const selectorList = selectorKeys
    .map(key => ({
      key,
      selector: normalizeSelector(selectors[key])
    }))
    .filter(({ selector }) => selector && !selector.global);
  const selectorListPure = selectorList.map(({ selector }) => selector);

  visitTree(
    document,
    (childNode: Element, ctx) => {
      if (__cache.get(childNode)) {
        ctx.skip()
        return
      }
      __cache.set(childNode, true)

      const matched = matchSelector(childNode, selectorListPure);
      if (matched) {
        const matchedNode = matched.node;

        const { selector, key } = selectorList[matched.selectorIndex];
        if (selector.type) {
          if (key === "text") {
            const node = generateTextNode(matchedNode, selector, {
              transformNode,
              allowInnerText
            });
            node && node.value && contents.push(node);
          } else if (isLvlType(key)) {
            const lvlNode = new LvlNode(parseLvlTypeLevel(key));
            const selectorItem = normalizeSelector(selectors[key]);
            lvlNode.value = transformVal(
              allowInnerText
                ? // @ts-ignore
                  matchedNode.innerText || matchedNode.textContent
                : matchedNode.textContent,
              selectorItem
            );
            lvlNode.domNode = matchedNode
            lvlNode.anchor = getAnchor(matchedNode, selectorItem);
            contents.push(lvlNode);

            if (
              matchedNode.nextElementSibling
            ) {
              const result = parseLvlChildren(
                matchedNode.nextElementSibling,
                selectors,
                lvlNode,
                { allowInnerText, transformNode, __cache }
              );
              lvlNode.children = result.children;

              if (typeof transformNode === 'function') {
                const index = contents.indexOf(lvlNode)
                const newLvlNode = transformNode(lvlNode)
                contents.splice(index, 1, newLvlNode)
              }

              // tmp.endElement = result.endElement;
              contents = contents.concat(result.nextElements);
            }
          } else {
            const node = generateTextNode(matchedNode, selector, {
              transformNode,
              type: key,
              allowInnerText
            });
            node && node.value && contents.push(node);
          }
          ctx.skip();
        }
      }
    },
    () => {},
    { path: "children" }
  );

  return contents;
}

export default function parseElementTree(
  document: Element,
  selectors: Selectors,
  {
    allowInnerText = false,
    transformNode
  }: Parameters<typeof parseElements>[2] = {}
): DocumentNode {
  const documentNode = new DocumentNode();
  const selectorKeys = uniq(LVL_TYPES.concat(Object.keys(selectors)));

  // Deals with global selector
  selectorKeys.forEach(selectorKey => {
    const selectorItem = normalizeSelector(selectors[selectorKey]);
    if (!selectorItem) return;

    if (selectorItem.global) {
      documentNode.global.set(
        selectorKey,
        selectorItem.multiple
          ? selectAllVal(selectorItem, document).texts
          : selectVal(selectorItem, document).text
      );
    }
  });

  documentNode.children = parseElements(document, selectors, {
    allowInnerText,
    transformNode,
  });

  return documentNode;
}
