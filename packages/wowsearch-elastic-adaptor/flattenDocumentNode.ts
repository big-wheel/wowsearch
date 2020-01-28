/**
 * @file flattenDocumentNode
 * @author Cuttle Cong
 * @date 2019/9/23
 *
 */
import DocumentNode from 'wowsearch-parse/dist/types/DocumentNode'
import * as visit from '@moyuyc/visit-tree'
import ContentNode from 'wowsearch-parse/dist/types/ContentNode'
import LvlNode from 'wowsearch-parse/dist/types/LvlNode'
import * as isObj from 'is-plain-object'
import {parseLvlTypeLevel} from 'wowsearch-parse'
import * as template from 'lodash.template'

export type FlattenedNode = {
  anchor: string
  url: string
  level: number
  type: 'text' | 'lvl' | any
  content: string
  parents: string[]
  [extraName: string]: any
}

export default (documentNode: DocumentNode, {url_tpl = '${url}#${anchor}'} = {}) => {
  let nodes = [] as FlattenedNode[]
  let parentsMap = new WeakMap<ContentNode, any[]>()

  let urlGetter = template(url_tpl)

  const rule = documentNode.urlRule as any

  let extraMeta = {} as any
  // @ts-ignore
  if (rule && isObj(rule)) {
    extraMeta = {...rule}
    delete extraMeta.test
  }

  const filterNode = node => node && node.value

  visit(
    documentNode,
    (node: ContentNode, ctx) => {
      const parents = (parentsMap.get(ctx.parent) || []).slice()
      let anchor
      if ((node as LvlNode).anchor) {
        anchor = (node as LvlNode).anchor
      } else {
        for (let i = parents.length - 1; i >= 0; i--) {
          const par = parents[i]
          if (par.anchor) {
            anchor = par.anchor
            break
          }
        }
      }

      const flattenedNode = {
        anchor,
        url: urlGetter({
          url: documentNode.href,
          anchor: anchor || '',
          ...node
        }),
        level: (node as LvlNode).level,
        type: node.type,
        content: node.value,
        parents: parents.map(x => x.value),
        ...extraMeta
      } as FlattenedNode
      if (node.type === 'document') {
        const global = (node as DocumentNode).global || new Map()
        const tasks = []
        Array.from(global.keys())
          .sort()
          .forEach(key => {
            const value = global.get(key)
            const level = parseLvlTypeLevel(key)
            if (level !== null) {
              parents[level] = {value: value}
            } else {
              extraMeta[key] = value
            }

            tasks.push(() => {
              nodes.push({
                ...flattenedNode,
                parents: parents.filter(filterNode).map(x => x.value),
                content: value,
                level,
                ...extraMeta
              })
            })
          })

        tasks.forEach(task => task())
      } else {
        nodes.push(flattenedNode)
      }

      parentsMap.set(node, parents.concat(node).filter(filterNode))
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
