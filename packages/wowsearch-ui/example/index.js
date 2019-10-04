/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import React from 'react'
import ReactDOM from 'react-dom'
import browserAdaptor from 'wowsearch-elastic-adaptor/browser'
import SearchUI from '../src'

ReactDOM.render(
  <SearchUI
    {...browserAdaptor({index_name: '_all', endpoint: 'https://es.dev.weiyun.baidu.com:8913/'})}
  />,
  window.root
)
