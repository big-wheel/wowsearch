/**
 * @file index
 * @author Cuttle Cong
 * @date 2019/9/19
 *
 */
import * as join from 'url-join'
import ky from 'ky-universal'
import * as chunk from 'lodash.chunk'
import flattenDocumentNode from '../flattenDocumentNode'
import DocumentNode from 'wowsearch-parse/dist/types/DocumentNode'

const debug = require('debug')('wowsearch:elastic-adaptor')

export type ElasticConfig = {
  index_name?: string
  endpoint?: string
  url_tpl?: string
  per_count?: number
}

module.exports = (wowsearchConfig: ElasticConfig = {}) => {
  const {
    index_name,
    url_tpl = '${url}#${anchor}',
    endpoint = process.env.WOWSEARCH_ELASTIC_ADAPTOR_ENDPOINT || 'http://localhost:9200/',
    per_count = 5000,
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
        url_tpl
      })
      if (list && list.length) {
        summeryList = summeryList.concat(list)
      }
    }
    if (!summeryList.length) return

    try {
      // delete index
      await ky.delete(join(endpoint, index_name), {
        timeout: 10000
      })
    } catch (e) {
      console.error('Delete index, error happens: %s', String(e))
    }

    let chunks = [summeryList]
    if (per_count > 0) {
      chunks = chunk(summeryList, per_count)
    }

    let id = 1
    return chunks.reduce((promise, list, currentIndex, {length}) => {
      return promise.then(() => {
        debug('Post bulk %s/%s', currentIndex + 1, length)
        return ky
          .post(join(endpoint, index_name, '_bulk'), {
            timeout: 10000,
            searchParams: {
              refresh: ''
            },
            headers: {
              'content-type': 'application/json'
            },
            body:
              list
                .map(item => {
                  return [JSON.stringify({index: {_id: '' + id++}}), JSON.stringify(item)].join('\n')
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
      })
    }, Promise.resolve())
  }
}
