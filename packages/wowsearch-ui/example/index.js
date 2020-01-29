/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import render from '../standalone'

render(window.root, {
  ...render.elasticAdaptor({ index_name: '_all', endpoint: process.env.WOWSEARCH_ELASTIC_ADAPTOR_ENDPOINT || '' }),
  placeholder: '搜索',
  openInNew: false
})
