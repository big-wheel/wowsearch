# wowsearch-parse

[![NPM version](https://img.shields.io/npm/v/wowsearch-parse.svg?style=flat-square)](https://www.npmjs.com/package/wowsearch-parse)
[![NPM Downloads](https://img.shields.io/npm/dm/wowsearch-parse.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/wowsearch-parse)

Document parser for generating tree struction

## Installation

```bash
npm install wowsearch-parse
# or use yarn
yarn add wowsearch-parse
```

## Usage

```javascript
import wowsearchParse from 'wowsearch-parse'

/*
domElement.outerHTML === `
<article>
  <div class="author">imcuttle</div>
  <p>content</p>
  <h1>h1</h1>
  <p>h1 content</p>
  <h2>h2-1</h2>
  <p>h2-1 content</p>
  <h2>h2-2</h2>
  <p>h2-2 content</p>
  <h1>h1-end</h1>
</article>
`
 */
wowsearchParse(
  domElement,
  {
    "author": {
      "global": true,
      "selector": ".author"
    },
    "lvl0": "h1",
    "lvl1": "h2",
    "lvl2": "h3",
    "lvl3": "h4",
    "text": "p, li, pre"
  }
) /*
 => DocumentNode {
   global: Map { author: "imcuttle" },
   type: "document",
   value: null,
   domNode: ...,
   children: [
     LvlNode {
       domNode: ...,
       type: "lvl",
       level: 1,
       value: 'h1',
       children: [
         TextNode {
           domNode: ...,
           type: 'text',
           value: 'h1 content',
         },
         LvlNode {
           type: 'lvl',
           level: 2,
           value: 'h2-1',
           domNode: ...,
           children: [
             TextNode { domNode: ..., type: 'text', value: 'h2-1 content' }
           ]
         },
         LvlNode {
           type: 'lvl',
           level: 2,
           value: 'h2-2',
           domNode: ...,
           children: [
             TextNode { domNode: ..., type: 'text', value: 'h2-2 content' }
           ]
         }
       ]
     },
     LvlNode {
       type: 'lvl',
       level: 1,
       value: 'h1-end',
       domNode: ...,
       children: []
     }
   ]
 }
*/
```

## API

## Related

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com"">moyuyc95@gmail.com</a>.

## License

MIT
