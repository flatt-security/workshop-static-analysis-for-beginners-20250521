---
marp: true
---

# 発展編

---

## CLI から実行してみよう

```
ast-grep scan --rule rule.yaml src/app/api
```

---

## VSCode で常時チェックしてみよう

[VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ast-grep.ast-grep-vscode)

---

## もっと複雑な検査条件にしてみよう

「`canXXX` を呼び出しているか」だけでなく「`canXXX` の返り値が false だったら、403 を返すか」も検査するようにしてみましょう。

```ts
const hasAccess = await canXXX(...);
if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```
