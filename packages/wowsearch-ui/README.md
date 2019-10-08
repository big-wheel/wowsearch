# wowsearch-ui

> 官方搜索 UI 组件

## 使用

### 作为 React 组件使用

```
import UI from 'wowsearch-ui'

ReactDOM.render(
  <UI />
  // ...
)
```

### 独立使用

```
import standalone from 'wowsearch-ui/standalone'

// standalone 为 https://github.com/imcuttle/react-pizza 实例
// 详见 https://github.com/imcuttle/react-pizza#readme
```


### CDN 独立使用

```
<script src="https://unpkg.com/wowsearch-ui@^0.0.13"></script>
<link rel="stylesheet" href="https://unpkg.com/wowsearch-ui/dist/style.css"/>

<div id="root"></div>
<script>
    /* eslint-disable */
    WowsearchUI('#root', WowsearchUI.elasticAdaptor({
        index_name: '_all'
    }));
</script>
```


## API

### Props

#### `fetcher`

- Type: `() => Promise<[]>`
