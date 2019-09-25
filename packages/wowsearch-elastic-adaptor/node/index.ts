/**
 * @file index
 * @author Cuttle Cong
 * @date 2019/9/19
 *
 */
import * as join from 'url-join'

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

  return (got, data, index, list) => {
    if (index === list.length - 1) {
      return got
        .post(join(endpoint, index_name, '_bulk'), {
          query: {
            refresh: ''
          },
          headers: {
            'content-type': 'application/json'
          },
          body: list
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
          console.log(response.body)
        })
    }
  }
}
