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
  data = {}
} = {}) => {
  return {
    async fetcher(value) {
      let body: any = await ky
        .post(join(endpoint, index_name, '_search'), {
          json: merge(
            {
              query: {
                multi_match: {
                  query: value,
                  fields: ['content', 'anchor'],
                  fuzziness: 'AUTO'
                }
              },
              highlight: {
                pre_tags: ['<span class="wowsearch-highlight">'],
                post_tags: ['</span>'],
                fields: {
                  content: {}
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

      return body.hits.hits.map(hit => {
        const title =
          hit._source.parents && hit._source.parents.length
            ? hit._source.parents[0]
            : hit._source.content
        const crumbs = hit._source.parents.slice(1)

        return {
          id: hit._id,
          url: hit._source.url,
          title,
          crumbs,
          content: hit._source.content
        }
      })
    }
  }
}
