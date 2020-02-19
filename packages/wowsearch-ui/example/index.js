/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import render from '../standalone'
import '../index.less'

render(window.root, {
  ...render.elasticAdaptor({ index_name: '_all', endpoint: process.env.WOWSEARCH_ELASTIC_ADAPTOR_ENDPOINT || '' }),
  placeholder: '搜索',
  autoFocus: true,
  tabIndex: 1,
  // openInNew: true,
  openInNew: false,
})
