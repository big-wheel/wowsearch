/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import render from '../standalone'
import browserAdaptor from 'wowsearch-elastic-adaptor/browser'

render(window.root, {
  ...browserAdaptor({ index_name: 'wiki_befe', endpoint: process.env.WOWSEARCH_ELASTIC_ADAPTOR_ENDPOINT || '' })
})
