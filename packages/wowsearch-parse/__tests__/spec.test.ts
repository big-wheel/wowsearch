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
  const { document } = new JSDOM(html).window
  return parseElementTree(document.body, config)
}

// TODO performance
describe('parseElementTree', function() {
  it('spec wiki', async function () {
    const docNode = await parse(
      readFileSync(makeFixture('wiki.html')).toString(),
      {
        "author": {
          "global": true,
          "selector": ".page-metadata .author"
        },
        "lvl0": {
          "selector": "#breadcrumbs > li:last-child a",
          "global": true
        },
        "lvl1": ".wiki-content h1",
        "lvl2": ".wiki-content h2",
        "lvl3": ".wiki-content h3",
        "lvl4": ".wiki-content h4",
        "text": ".wiki-content p, .wiki-content li, .wiki-content pre"
      }
    )

    expect(docNode).toMatchSnapshot()
  });

  it('spec edam', async function() {
    const docNode = await parse(
      readFileSync(makeFixture('edam.html')).toString(),
      {
        lvl0: {
          selector:
            "//*[contains(@class,'navGroupActive')]//a[contains(@class,'navItemActive')]/preceding::h3[1]",
          type: 'xpath',
          global: true,
          default_value: 'Documentation'
        },
        lvl1: {
          type: 'css',
          global: true,
          selector: '.post h1'
        },
        lvl2: '.post article h1',
        lvl3: '.post article h2',
        lvl4: '.post article h3',
        lvl5: '.post article h4',
        text: '.post article p, .post article li'
      }
    )

    expect(docNode).toMatchSnapshot()
  })

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

  it('should doc.html', async function () {
    const docNode = await parse(
      readFileSync(makeFixture('doc.html')).toString(),
      {
        lvl0: '.Post-RichText h1',
        lvl1: '.Post-RichText h2',
        lvl2: '.Post-RichText h3',
        lvl3: '.Post-RichText h4',
        lvl4: '.Post-RichText h5',
        lvl5: '.Post-RichText h6',
        code: '.Post-RichText pre',
        text:
          '.Post-RichText table, .Post-RichText p, .Post-RichText img, .Post-RichText ul, .Post-RichText ol, .Post-RichText li'
      }
    )
    expect(docNode).toMatchSnapshot()
  });
})
