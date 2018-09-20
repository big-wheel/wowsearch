# wowsearch

[![build status](https://img.shields.io/travis/big-wheel/wowsearch/master.svg?style=flat-square)](https://travis-ci.org/big-wheel/wowsearch)
[![Test coverage](https://img.shields.io/codecov/c/github/big-wheel/wowsearch.svg?style=flat-square)](https://codecov.io/github/big-wheel/wowsearch?branch=master)
[![NPM version](https://img.shields.io/npm/v/wowsearch.svg?style=flat-square)](https://www.npmjs.com/package/wowsearch)
[![NPM Downloads](https://img.shields.io/npm/dm/wowsearch.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/wowsearch)

The search's workflow like docsearch.

**⚠ Working in progress**

## 介绍

这是一个搜索网页的玩意，适合于网页上内容索引（搜索）。  
核心的工作流程为：  
 爬虫引擎 == 解析网页 ==> 数据适配 ==> 推送数据至数据索引服务（如 [elasticsearch](https://github.com/elastic/elasticsearch)，[algolia](https://www.algolia.com/)）
 
 同时提供前端 ui（不同的平台，数据获取方式不同），类似于 [docsearch](https://github.com/algolia/docsearch)
 
## 应该有哪些东西

- 爬虫引擎 - 如 [docsearch-scraper](https://github.com/algolia/docsearch-scraper)
- 数据适配
  - elasticsearch 1.x
- 前端UI - 如 [docsearch](https://github.com/algolia/docsearch)
  - 不同数据来源

## 开发注意点

- 使用 TypeScript
