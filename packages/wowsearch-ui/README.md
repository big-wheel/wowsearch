# wowsearch-ui

> 官方搜索 UI 组件

## 使用

### 作为 React 组件使用

```jsx
import WowseasrchUI from 'wowsearch-ui'
import elasticAdaptor from 'wowsearch-elastic-adaptor/browser'
import 'wowsearch-ui/index.less'

ReactDOM.render(
  <WowseasrchUI {...elasticAdaptor({ index_name: '你的索引名' })} />
  // ...
)
```

### 独立使用 (项目环境不依赖 React)

```
import wowsearchUI from 'wowsearch-ui/standalone'
import 'wowsearch-ui/index.less'

// wowsearchUI 为 https://github.com/imcuttle/react-pizza 实例
// 详见 https://github.com/imcuttle/react-pizza#readme

const ui = wowsearchUI(
    '#root',
    wowsearchUI.elasticAdaptor({
        index_name: '_all'
    })
);
```


### CDN 独立使用

```
<script src="https://unpkg.com/wowsearch-ui"></script>
<link rel="stylesheet" href="https://unpkg.com/wowsearch-ui/dist/style.css"/>

<div id="root"></div>
<script>
    /* eslint-disable */
    WowsearchUI('#root', WowsearchUI.elasticAdaptor({
        index_name: '_all'
    }));
</script>
```

### Props

wowsearch-ui 继承 [rc-select](https://github.com/react-component/select) 配置 

#### `fetcher`

搜索时获取数据请求，一般通过 `elasticAdaptor` 输出

- Type: `(inputValue) => Promise<[]>`

#### `openInNew`
是否在新窗口打开页面
- Default: `false`
- Type: `boolean`
