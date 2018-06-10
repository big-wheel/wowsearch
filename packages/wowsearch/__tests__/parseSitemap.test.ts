/**
 * @file main.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import parse, { parseSitemapTXT, parseSitemapXML } from '../src/parseSitemap'
import { makeFixture } from './help'
import { readFileSync } from 'fs'

describe('parseSitemap', function() {
  it('parseSitemapXML', async function() {
    let data = await parseSitemapXML(
      readFileSync(makeFixture('sitemap.xml')).toString()
    )
    expect(data).toMatchSnapshot()
  })

  it('parseSitemapTXT', function() {
    let data = parseSitemapTXT(
      readFileSync(makeFixture('sitemap.txt')).toString()
    )
    expect(data).toEqual([
      'http://www.baidu.com/',
      'http://www.baidu.com/a',
      'http://www.baidu.com/b'
    ])
  })

  it('should parse from url', async function() {
    console.log(await parse('http://origin.eux.baidu.com:8666/sitemap.xml'))
  })
})
