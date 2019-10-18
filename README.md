# wowsearch

[![build status](https://img.shields.io/travis/big-wheel/wowsearch/master.svg?style=flat-square)](https://travis-ci.org/big-wheel/wowsearch)
[![Test coverage](https://img.shields.io/codecov/c/github/big-wheel/wowsearch.svg?style=flat-square)](https://codecov.io/github/big-wheel/wowsearch?branch=master)
[![NPM version](https://img.shields.io/npm/v/wowsearch.svg?style=flat-square)](https://www.npmjs.com/package/wowsearch)
[![NPM Downloads](https://img.shields.io/npm/dm/wowsearch.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/wowsearch)

一个开源的，基于爬虫的文档搜索工作流

## 介绍

这是一个搜索网页的玩意，适合于网页上内容索引（搜索）。  
核心的工作流程为：

```text
爬虫引擎 == 解析网页 ==> 数据适配 ==> 推送数据至数据索引服务 或 数据库（如 [elasticsearch](https://github.com/elastic/elasticsearch)，[algolia](https://www.algolia.com/)）
```

同时索引服务提供 Web API 用于搜索数据，并提供 UI 界面提供搜索交互 #1 使用户方便接入使用

### 怎么使用？

在 `npm i wowsearch` 之后，如下代码使用

```javascript
import wowsearch from 'wowsearch'

const passed = await wowsearch({
  // Write config here
})
passed && console.log('wowsearch! 完成了站点数据爬取，同时推送至了远端')
```

[配置说明点这](./packages/wowsearch)
[查看配置案例](./packages/wowsearch-standalone/example)

### 如何贡献代码

1. clone 代码库
2. 在项目根目录执行脚本
```bash
npm i
npm run bootstrap
```

- commit message 规范走 [conventionalcommits](https://www.conventionalcommits.org)
- 项目包管理使用 [lerna](https://github.com/lerna/lerna)
