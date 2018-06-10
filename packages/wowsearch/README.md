# 爬虫引擎

## 难度 TODO

- [ ] HTML 层次解析
  ```text
  h1
      h2.a
        content
      h2.b
  ```
  以上结构应该解析成为 [h1.textContent, (h1.textContent + h2.a.textContent), (h1.textContent + h2.a.textContent + content), (h1.textContent + h2.b.textContent)] 四条记录。
