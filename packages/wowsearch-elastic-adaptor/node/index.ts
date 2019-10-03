/**
 * @file index
 * @author Cuttle Cong
 * @date 2019/9/19
 *
 */
import * as join from 'url-join'
import ky from 'ky-universal'
import flattenDocumentNode from '../flattenDocumentNode'
import DocumentNode from 'wowsearch-parse/dist/types/DocumentNode'

export type ElasticConfig = {
  index_name?: string
  endpoint?: string
}

module.exports = (wowsearchConfig: ElasticConfig = {}) => {
  const {
    index_name,
    endpoint = 'http://localhost:9200/',
    ...rest
  } = wowsearchConfig

  if (!index_name) {
    throw new Error('"index_name" is required, but ' + index_name)
  }
  if (!endpoint) {
    throw new Error('"endpoint" is required, but ' + endpoint)
  }

  return async (data, config) => {
    let summeryList = []

    for (const [href, docNode] of Object.entries(data)) {
      const list = flattenDocumentNode(docNode as DocumentNode, {
        url_tpl: config.url_tpl
      })
      if (list && list.length) {
        summeryList = summeryList.concat(list)
      }
    }
    if (!summeryList.length) return

    // delete index
    await ky.delete(join(endpoint, index_name), {})

    return ky
      .post(join(endpoint, index_name, '_bulk'), {
        searchParams: {
          refresh: ''
        },
        headers: {
          'content-type': 'application/json'
        },
        body:
          summeryList
            .map((item, id) => {
              return [
                JSON.stringify({ index: { _id: '' + id } }),
                JSON.stringify(item)
              ].join('\n')
            })
            .join('\n') + '\n',
        ...rest
      })
      .then(response => {
        return response.json()
      })
      .then(body => {
        // console.log(body)
      })
  }
}
