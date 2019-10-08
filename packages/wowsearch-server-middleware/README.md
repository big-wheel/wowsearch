# `wowsearch-server-middleware`

> A http middleware with wowsearch crawling corntab, schedule crawling and config encryption.

## Usage

```
const middle = require('wowsearch-server-middleware');

const app = require('express')()

app.use(middle(
  '/path/to/configRoot',
  {
    // options
  }
))
```

## API

### `wowsearchServerMiddleware`

- Type: `(workPath: string, options?: {}) => Function[]`

#### `workPath`

配置文件集合所在的文件夹，同 [wowsearch-standalone#configRootPath](../wowsearch-standalone#configrootpath)

#### `scheduleInput`

定时任务规则，传入配置规则请看：https://www.npmjs.com/package/node-schedule

默认每周日 0 点执行定时任务

- Type: `string`
- Default: `'0 0 * * 0'`

#### `runTaskFile`

在子进程中执行任务的文件路径，该配置用于自定义执行任务

- Type: `string`
- Default: [runTask.js](./lib/runTask.js)

#### `concurrency`

runTask 任务的最大并发量

- Type: `number`
- Default: `Math.max(cpus().length - 1, 1)`

#### `publicKey` / `publicKeyPath`

公钥的文本或者文件路径，传一个值即可

- Type: `string`

#### `privateKeyPath` / `privateKey`

密钥的文本或者文件路径，传一个值即可

- Type: `string`

#### `token`

参看：https://github.com/imcuttle/express-restful-fileman

#### `enableDelete`

参看：https://github.com/imcuttle/express-restful-fileman

- Default: `true`

#### `browserViewRoute`

参看：https://github.com/imcuttle/express-restful-fileman

- Default: `'/fileman'`

## Web API

### `POST /run`

触发全部爬虫任务

### `POST /run/:glob`

触发某些爬虫任务

### `GET /run-date-list`

查看爬虫执行任务历史记录

### `GET /public-key`

获取公钥，一般搭配 [wowsearch-crypto](../wowsearch-crypto) 来加密 `request_cookie`

### 其他

其他路由规则集成 https://github.com/imcuttle/express-restful-fileman
