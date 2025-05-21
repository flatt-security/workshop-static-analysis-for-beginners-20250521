---
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# ルール作成の流れ

---

## ルール作成の流れ

**お題**:「`canXXX` を呼び出していないリクエストハンドラ一覧を抽出」

以下のステップでルールを組んでいきましょう:

1. [リクエストハンドラ一覧を抽出するルールを書く](./02-02-list-request-handlers.md)
1. [`canXXX` を呼び出している箇所一覧を抽出するルールを書く](./02-03-authz-function-calls.md)
1. [以上を組み合わせて、`canXXX` を呼び出していないリクエストハンドラ一覧を抽出するルールを書く 🏁](./02-04-integrate.md)
