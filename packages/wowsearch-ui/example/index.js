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
import mockData from './mock_zhuting'

ReactDOM.render(
  <SearchUI
    {...browserAdaptor({index_name: 'temp'})}
    fetcher={
      () => {
        return  mockData
      }
    }
    // fetcher: () => {}
  />,
  window.root
)
