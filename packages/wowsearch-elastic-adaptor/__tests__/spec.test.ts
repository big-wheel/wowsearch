/**
 * @file spec
 * @author imcuttle
 * @description
 */
import { crawl } from 'wowsearch/src/crawl'
import { readFileSync } from 'fs'
import { makeFixture } from './help'
import flattenDocumentNode from '../flattenDocumentNode'


describe('flattenDocumentNode', function() {
  it('should flattenDocumentNode spec', async function() {
    const { documentNode } = await crawl(
      readFileSync(makeFixture('text.html')).toString(),
      {
        // strip_chars: 'r',
        selectors: {
          lvl0: '#readme .package-name-redundant',
          lvl1: '#readme h1:not(.package-name-redundant)',
          lvl2: {
            selector: '//*[@id="readme"]//h2',
            type: 'xpath'
          },
          lvl3: {
            selector: '#readme h3'
          },
          lvl4: { selector: '#readme h4', default_value: 'abc' },
          text: '#readme > p, #readme li, #readme code, #readme pre'
        },
        selectors_exclude: ['#readme .deep-link']
      }
    )

    expect(flattenDocumentNode(documentNode)).toMatchSnapshot()
  })
})
