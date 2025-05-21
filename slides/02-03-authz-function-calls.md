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

---

## ゴール

権限チェックの関数 ("can" から始まる) を呼び出している箇所を抽出するルールを書く

```ts
const hasAccess = await canAccessTodo(
  session.user.id,
  todoId,
  session.user.role,
  session.user.tenantId
);
```

---

## ヒント

「名前が "can" で始まる」という条件は、Pattern では表現できません
YAML でルールを記述すればより細かく条件を指定できます

Playground 左下の構文木を見ながら、「所望のノードを抽出するルール」を考えてみましょう

- [Rule Essentials](https://ast-grep.github.io/guide/rule-config.html)
- [Rule Object Reference](https://ast-grep.github.io/reference/rule.html)

Template:
```yaml
language: ts

rule:
  # FILL HERE
```

---

[ルール例](./02-03-authz-function-calls-answer.md) (ネタバレ)
Next: [`canXXX` を呼び出していないリクエストハンドラ一覧を抽出するルールを書く](./02-04-integrate.md)
