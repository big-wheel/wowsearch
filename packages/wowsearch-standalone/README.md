# wowsearch-standalone

[![NPM version](https://img.shields.io/npm/v/wowsearch-standalone.svg?style=flat-square)](https://www.npmjs.com/package/wowsearch-standalone)
[![NPM Downloads](https://img.shields.io/npm/dm/wowsearch-standalone.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/wowsearch-standalone)

生产环境下的执行程序，会执行固定文件夹下的配置文件，可以用于做定时任务进行爬虫，如 [wowsearch-server-middleware](../wowsearch-server-middleware)

## Installation

```bash
npm install wowsearch-standalone
# or use yarn
yarn add wowsearch-standalone
```

## Usage

```javascript
import wowsearchStandalone from 'wowsearch-standalone'

wowsearchStandalone({
 // ...
})
.then((resultList) => {console.log('done')}
```

## API

### `wowsearchStandalone`

- Type: `(/* options */) => Promise<boolean[]>`

### Options

#### `cwd`

运行工作目录

- Type: `string`
- Default: `process.cwd()`

#### `configRootPath`

配置文件集合所在的文件夹

- Type: `string`
- Default: `${cwd}/configs`

#### `configFileGlob`

配置文件的 pattern，见 https://github.com/isaacs/minimatch#usage

入未设置，则会设置为 `$CONFIG_FILE_GLOB` 或者 `'*.{js.json}'`

- Type: `string|string[]`
- Default: `$CONFIG_FILE_GLOB || '*.{js.json}'`

#### `transformConfig`

用于转换配置

- Type: `(filename, config) => Promise<{}>`

## Related

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com"">moyuyc95@gmail.com</a>.

## License

MIT
