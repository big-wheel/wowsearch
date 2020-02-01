/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import React from 'react'
import Select, {Option, OptGroup} from 'rc-select'
import * as groupBy from 'lodash.groupby'
import {INTERNAL_PROPS_MARK} from 'rc-select/es/interface/generator'
import {selectPrefix} from '!get-less-vars/loader!./index.less'
import * as PropTypes from 'prop-types'
import {robust} from 'memoize-fn'
import SearchOption from './SearchOption'

SearchUI.propTypes = {
  fetcher: PropTypes.func.isRequired,
  openInNew: PropTypes.bool,
  placeholder: PropTypes.node
}

export default function SearchUI({fetcher, placeholder, openInNew = false, ...props}) {
  const mFetcher = React.useMemo(() => {
    return robust(fetcher, {})
  }, [fetcher])

  const [dataSource = {}, setDataSource] = React.useState({})
  const fetchData = async value => {
    // todo error handler
    let list = await mFetcher(value)
    if (list && list.length) {
      const groups = groupBy(list, 'headerTitle')
      setDataSource(groups)
    } else {
      setDataSource({})
    }
  }

  const options = Object.keys(dataSource).map((name, index, {length}) => {
    const list = dataSource[name]
    return (
      <OptGroup
        key={name}
        label={
          length > 1 && <div className="wowsearch-ui-search-category-header" dangerouslySetInnerHTML={{__html: name}} />
        }
      >
        {list.map(d => {
          return (
            <Option key={d.id} value={d.id} raw={d}>
              <SearchOption openInNew={openInNew} {...d} />
            </Option>
          )
        })}
      </OptGroup>
    )
  })

  return (
    <Select
      notFoundContent={'没有找到'}
      listHeight={'400px'}
      internalProps={{
        onRawSelect: (value, option, source) => {
          if (option && option.raw) {
            if (option.raw.url) {
              if (openInNew) {
                window.open(option.raw.url)
              } else {
                location.href = option.raw.url
              }
            }
          }
        },
        mark: INTERNAL_PROPS_MARK,
        skipTriggerChange: true
      }}
      dropdownMatchSelectWidth
      labelInValue
      inputIcon={() => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 30 30"
          style={{
            fill: '#000'
          }}
        >
          <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
        </svg>
      )}
      prefixCls={selectPrefix}
      onSearch={fetchData}
      showSearch
      value={null}
      optionLabelProp="children"
      placeholder={placeholder}
      {...props}
      filterOption={false}
    >
      {options}
    </Select>
  )
}
