# wowsearch-elastic-adaptor

[![NPM version](https://img.shields.io/npm/v/wowsearch-elastic-adaptor.svg?style=flat-square)](https://www.npmjs.com/package/wowsearch-elastic-adaptor)
[![NPM Downloads](https://img.shields.io/npm/dm/wowsearch-elastic-adaptor.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/wowsearch-elastic-adaptor)

wowsearch adaptor for elastic

## Installation

```bash
npm install wowsearch-elastic-adaptor
# or use yarn
yarn add wowsearch-elastic-adaptor
```

## Usage

- `wowsearch config`

```text
source_adaptor: {
  "name": "wowsearch-elastic-adaptor/node",
  "options": {
    "endpoint": "https://example.elasticsearch.com"
    "index_name": "my_blog",
    // "url_tpl": ""
  }
}
```

## API

### `wowsearch-elastic-adaptor/node`

#### `index_name`

elasticsearch 的索引名

#### `endpoint`

elasticsearch 的服务端地址

- Default: `process.env.WOWSEARCH_ELASTIC_ADAPTOR_ENDPOINT || 'http://localhost:9200/'`

#### `url_tpl`

拼凑某数据节点完整地址的模板，一般在使用 hash 路由的站点，需要设置为 `'${url}'`

- Default: '${url}#${anchor}'

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com"">moyuyc95@gmail.com</a>.

## License

MIT
