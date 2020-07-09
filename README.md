<p align="center">
    <img width="240" src="./logo.png" />
</p>

<h3 align="center">wowsearch</h3>

<p align="center">
  <a href="https://travis-ci.org/big-wheel/wowsearch"><img src="https://img.shields.io/travis/big-wheel/wowsearch/master.svg?style=flat-square" /></a>
  <a href="https://codecov.io/github/big-wheel/wowsearch?branch=master"><img src="https://img.shields.io/codecov/c/github/big-wheel/wowsearch.svg?style=flat-square" /></a>
  <a href="https://prettier.io/"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" /></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square" /></a>
</p>
<p align="center">一个开源的，基于爬虫的文档搜索工作流</p>

<p align="center"><img alt="" src="https://i.loli.net/2020/07/09/yQqnLW6DlI2gjms.png" /></p>

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

### Todo
- [ ] 目前使用 wowsearch 使用主进程负责 http 服务（获取爬取任务），child process 处理爬取任务；后续改造成使用 mq 管理任务和通信，不同的节点单独负责单独的任务（web + mq + crawl）
 
