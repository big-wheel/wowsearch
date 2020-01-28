/**
 * @file index.ts
 * @author Cuttle Cong
 * @date 2019/9/28
 *
 */
import * as join from 'url-join'
import ky from 'ky-universal'
import * as merge from 'lodash.merge'

export default ({
  endpoint = 'http://localhost:9200/',
  index_name = null,
  size = 10,
  // 放置预设的 过滤条件，如 lang: 'zh'
  filters = null,
  data = {},
  filter = list => list
} = {}) => {
  return {
    async fetcher(value) {
      let body: any = await ky
        .post(join(endpoint, index_name, '_search'), {
          json: merge(
            {
              query: {
                bool: {
                  must: [
                    filters && {term: filters},
                    {
                      multi_match: {
                        query: value,
                        fields: ['content', 'anchor', 'parents']
                        // fuzziness: 'AUTO'
                      }
                    }
                  ].filter(Boolean)
                }
              },
              highlight: {
                pre_tags: ['<span class="wowsearch-ui-search-highlight">'],
                post_tags: ['</span>'],
                encoder: 'html',
                fields: {
                  content: {},
                  parents: {}
                }
              },
              size
            },
            data
          )
          // mode: 'no-cors'
        })
        .json()

      if (body.error) {
        throw new Error(body.error.reason)
      }

      return filter(
        body.hits.hits.map(hit => {
          const source = Object.assign({}, hit._source, hit.highlight)
          const title = source.parents && source.parents.length ? source.parents[0] : source.content
          const crumbs = source.parents.slice(1)

          return {
            id: hit._id,
            headerTitle: hit._index,
            url: source.url,
            title,
            crumbs,
            content: source.content
          }
        })
      )
    }
  }
}
