/**
 * @file main.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { readFileSync } from 'fs'
import { makeFixture } from './help'
import parseElementTree from '..'
import { JSDOM } from 'jsdom'

const parse = (html, config) => {
  const {document} = new JSDOM(html).window
  return parseElementTree(document, config)
}

describe('parseElementTree', function() {
  it('spec', async function() {
    const docNode = await parse(
      readFileSync(makeFixture('text.html')).toString(),
      {
        lvl1: '#readme h1:not(.package-name-redundant)',
        lvl0: {
          global: true,
          selector: '#readme .package-name-redundant',
          type: 'css'
        },
        lvl2: {
          selector: '//*[@id="readme"]//h2',
          type: 'xpath'
        },
        lvl3: {
          selector: '#readme h3'
        },
        lvl4: { selector: '#readme h4', default_value: 'abc' },
        text: '#readme > p, #readme li, #readme code, #readme pre'
      }
    )

    expect(docNode).toMatchSnapshot()
  })

  it('spec without global', async function() {
    const docNode = await parse(
      readFileSync(makeFixture('text.html')).toString(),
      {
        lvl1: '#readme h1:not(.package-name-redundant)',
        lvl0: '#readme .package-name-redundant',
        lvl2: {
          selector: '//*[@id="readme"]//h2',
          type: 'xpath'
        },
        lvl3: {
          selector: '#readme h3'
        },
        lvl4: { selector: '#readme h4', default_value: 'abc' },
        text: '#readme > p, #readme li, #readme code, #readme pre'
      }
    )

    expect(docNode).toMatchSnapshot()
  })

})
