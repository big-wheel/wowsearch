/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import React from 'react'
import p from 'prefix-classname'
import './index.less'

const c = p('')
const cn = p('wowsearch-search-option-')


export default function SearchOption({className, title, crumbs = [], url, content}) {
  return <a href={url} className={c(cn('wrapper'), className)}>
    <div className={cn('left')}>
      {title}
    </div>
    <div className={cn('right')}>
      <div className={cn('header')}>
        {crumbs.map((crumb, i) => {
          const preCrumb = i > 0 ? ' > ' : ''
          return <span key={i} className={cn('crumb')}>{preCrumb}{crumb}</span>
        })}
      </div>
      <div className={cn('body')}>
        {content}
      </div>
    </div>
  </a>
}
