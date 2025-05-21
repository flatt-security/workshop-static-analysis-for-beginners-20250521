---
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# リクエストハンドラ一覧を抽出する

---

## ゴール

サンプルコード内に定義されているリクエストハンドラすべて (`GET`, `PATCH`, `DELETE`) を抽出するパターンを書く

```ts
export async function GET(/* ... */) {
  // ...
}
```

※Playground の右パネルでは「Pattern」タブを選択してください

---

## ヒント

- [Pattern Syntax](https://ast-grep.github.io/guide/pattern-syntax.html)

---

[ルール例](./02-02-list-request-handlers-answer.md) (ネタバレ)
Next: [`canXXX` を呼び出している箇所一覧を抽出するルールを書く](./02-03-authz-function-calls.md)
