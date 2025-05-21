---
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# `canXXX` を呼び出している箇所一覧を抽出する

```yaml
language: ts

rule:
  kind: call_expression
  has:
    field: function
    kind: identifier
    regex: ^can.+$
```
