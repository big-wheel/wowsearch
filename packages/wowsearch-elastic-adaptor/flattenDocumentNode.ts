/**
 * @file flattenDocumentNode
 * @author Cuttle Cong
 * @date 2019/9/23
 *
 */
import DocumentNode from 'wowsearch-parse/types/DocumentNode'
import * as visit from '@moyuyc/visit-tree'
import ContentNode from 'wowsearch-parse/types/ContentNode'
import LvlNode from 'wowsearch-parse/types/LvlNode'
import { parseLvlTypeLevel } from 'wowsearch-parse'
import * as template from 'lodash.template'

export type FlattenedNode = {
  anchor: string
  url: string
  level: number
  type: 'text' | 'lvl' | any
  content: string
  parents: string[]
  // for filter
  tags: string[]
}

export default (documentNode: DocumentNode, {
  url_tpl = '${url}#${anchor}'
} = {}) => {
  let nodes = [] as FlattenedNode[]
  let parentsMap = new WeakMap<ContentNode, string[]>()

  let urlGetter = template(url_tpl)
  visit(
    documentNode,
    (node: ContentNode, ctx) => {
      const anchor = (node as LvlNode).anchor
      const flattenedNode = {
        anchor,
        url: urlGetter({url: documentNode.href, anchor: anchor || '', ...node}),
        level: (node as LvlNode).level,
        type: node.type,
        content: node.value,
        parents: parentsMap.get(ctx.parent) || [],
        tags: []
      } as FlattenedNode
      const parents = flattenedNode.parents.slice()
      if (node.type === 'document') {
        const global = (node as DocumentNode).global || new Map()
        for (const [key, value] of global.entries()) {
          const level = parseLvlTypeLevel(key)
          if (level !== null) {
            parents[level] = value
          }
          nodes.push({
            ...flattenedNode,
            content: value,
            level
          })
        }
      } else {
        nodes.push(flattenedNode)
      }

      parentsMap.set(node, parents.concat(node.value).filter(Boolean))
      // nodes.push({
      //   ...flattenedNode,
      //   content: value
      // })
      //
      // parentsMap.set(node, parents)
    },
    {
      path: 'children'
    }
  )

  return nodes
}
