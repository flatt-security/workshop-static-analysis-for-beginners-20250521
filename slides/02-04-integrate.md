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

---

## 概要

ここまでできました:
- リクエストハンドラ一覧を抽出する
- `canXXX` を呼び出している箇所一覧を抽出する


これらを組み合わせ、欲しかったルールを作りましょう
**お題**:「`canXXX` を呼び出していないリクエストハンドラ一覧を抽出」

---

## ヒント

- [Relational Rules](https://ast-grep.github.io/guide/rule-config/relational-rule.html)

---

## ヒント

「リクエストハンドラ」AND「NOT `canXXX` の呼び出しがある」

---

## ヒント

`has:` はデフォルトで1階層しか検索しない

より深く検索するには `stopBy:` を指定

---

[ルール例](./02-04-integrate-answer.md) (ネタバレ)

Next:
- [発展編](./03-advanced.md)
- [クロージング](./04-outro.md)
