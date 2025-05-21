---
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# `canXXX` を呼び出していないリクエストハンドラ一覧を抽出する

```
language: ts

rule:
  all:
    - pattern: 'export async function $NAME($$$PARAMS) { $$$BODY }'
    - not:
        has:
          kind: call_expression
          has:
            field: function
            kind: identifier
            regex: ^can.+$
          stopBy: end
```
