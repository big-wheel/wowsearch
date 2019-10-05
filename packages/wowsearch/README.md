# wowsearch

## 配置说明

#### `concurrency`

爬虫程序最大并发数量

- Type: `number`
- Default: `cpus().length - 1`

#### `js_render`

使用[无头浏览器 puppeteer](https://github.com/GoogleChrome/puppeteer)爬取 HTML  
**注意：该选项适合于爬取未使用服务端渲染的站点**

- Type: `boolean`
- Default: `false`

#### `js_waitfor`

查看[`waitFor`](https://github.com/GoogleChrome/puppeteer/blob/v1.20.0/docs/api.md#pagewaitforselectororfunctionortimeout-options-args)

- Type: `string | number | Function`

#### `timeout`

爬取数据时候的超时毫秒数

- Type: `number`
- Default: `30000`

#### `start_urls`

爬取站点的入口地址，如 `['https://blog.com']`

- Type: `string[]`
- Default: `[]`

#### `start_urls_patterns`

地址适配规则，如 `['https://blog.com/**']`

**特殊的**，使用如下配置项，可以用于区分不同环境（如中英文环境文档）

```javascript
;[
  {
    test: 'https://imcuttle.github.io/edam/**/*_zh',
    tags: ['zh']
  },
  {
    test: 'https://imcuttle.github.io/edam/**/*',
    tags: ['en']
  }
]
```

- Type: `Array<Rule>` [Rule](#rule)
- Default: `[/.*/]`

#### `stop_urls_patterns`

无视的地址适配规则

- Type: `Array<Rule>` [Rule](#rule)
- Default: `[]`

#### `sitemap_urls`

站点地图的地址，支持 `sitemap.xml` 和 `sitemap.txt`

- Type: `string[]`
- Default: `[]`


#### `selectors_exclude`

忽略的节点选择器，一般用于省略一些不需要分析的节点

- Type: `string[]`

#### `selectors`

爬取的网页节点的选择器集合

- Type: [`Selectors`](#selectors)
- Default: `{}`

#### `anchor_selector`

使用在 lvl 选择器中，寻找锚点的选择器

- Type: [`Selector`](#selector)
- Default: `'a[id]'`

#### `anchor_attribute_name`

使用在 lvl 选择器中，锚点节点中锚点的属性

- Type: `string`
- Default: `'id'`

#### `smart_crawling`

开启智能爬虫模式，分析网页中的 a 标签，扩展需要爬取的地址

- Type: `boolean`
- Default: `false`

#### `smart_crawling_selector`

智能爬虫模式，分析 a 标签的选择器

- Type: [`Selector`](#selector)
- Default: `a[href]`

#### `force_crawling_urls`

开启强制使用智能分析的 url，否则将使用 [`start_urls_patterns`](#start_urls_patterns) 和 [`stop_urls_patterns`](#stop_urls_patterns) 进行过滤

- Type: `boolean`
- Default: `false`

#### `source_adaptor`

数据适配器，指定数据推送的远端，如

```
{
  "name": "wowsearch-elastic-adaptor/node",
  "options": {
    "endpoint": "https://example.elasticsearch.com"
    "index_name": "my_blog"
  }
}
```

- Type: `{name: string, options: any}`

### `Rule`

- Type: `RegExp | Function | string | {test: RegExp | Function | string, [key: string]: any}`

### `Selectors`

- Type: `Object`

#### `lvl0`

0 级选择器，一般用于选择文章标题，如

```javascript
{
  global: true,
  selector: '.post .title'
}
```

- Type: [`Selector`](#selector)

#### `lvl1`

1 级选择器，一般用于选择文章一级标题，如

```javascript
{
  global: true,
  selector: '.post article h1'
}
```

- Type: [`Selector`](#selector)

#### `lvl2`

2 级选择器，一般用于选择文章二级标题

- Type: [`Selector`](#selector)

#### `lvl3`

同上

- Type: [`Selector`](#selector)

#### `lvl4`

同上

- Type: [`Selector`](#selector)

#### `lvl5`

同上

- Type: [`Selector`](#selector)

#### `lvl6`

同上

- Type: [`Selector`](#selector)

#### `text`

纯文本选择器，如 `.post article li, .post article p, .post article pre`

### `Selector`

- Type: `string | StrictSelector`

### `StrictSelector`

- Type: `Object`

#### `strip_chars`

选择器文本需要剔除的字符串，用于剔除一些不必要的字符

- Type: `string`
- Default: `' .,;:§¶'`

#### `type`

选择器的类型

- Type: `'xpath' | 'css'`
- Default: `'css'`

#### `global`

是否是全局选择器。全局选择器将在一个页面中全局存在一个，一般用于寻找文章的标题

- Type: `boolean`

#### `default_value`

未找到的话，所使用的默认值

- Type: `string`

#### [`anchor_attribute_name`](#anchor_attribute_name)

#### [`anchor_selector`](#anchor_selector)
