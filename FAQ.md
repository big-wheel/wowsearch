## 常见问题解答

#### 怎么爬取非服务端渲染站点？

在配置中需要传入 `js_render: false`, 同时搭配 `js_waitfor` 配置判断页面是否加载完成

#### 对于 `request_cookie` 应该如何加密，防止泄露 cookie


