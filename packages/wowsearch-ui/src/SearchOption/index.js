/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import React from 'react'
import p from 'prefix-classname'

const c = p('')
const cn = p('wowsearch-search-option-')

export default function SearchOption({className, openInNew, title, crumbs = [], url, content}) {
  return (
    <a onClick={evt => {
      if (!evt.metaKey) {
        // 不走 a 默认的跳转逻辑
        evt.preventDefault()
      } else {
        evt.stopPropagation()
      }
    }} target={openInNew ? '_blank' : '_self'} href={url} className={c(cn('wrapper'), className)}>
      <div className={cn('left')} dangerouslySetInnerHTML={{__html: title}} />
      <div className={cn('right')}>
        <div className={cn('header')}>
          {crumbs.map((crumb, i) => {
            const preCrumb = i > 0 ? ' > ' : ''
            return <span key={i} className={cn('crumb')} dangerouslySetInnerHTML={{__html: preCrumb + crumb}} />
          })}
        </div>
        <div className={cn('body')} dangerouslySetInnerHTML={{__html: content}} />
      </div>
    </a>
  )
}
