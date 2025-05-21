---
marp: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# ハンズオンのお題

---

## ハンズオンのお題

🏁 API のリクエストハンドラの中で、権限チェック関数を呼び出し忘れていないか検査したい
権限チェック関数は `canXXX` という命名規則

→ `canXXX` を呼び出していないリクエストハンドラ一覧を抽出する ast-grep のルールを作ろう


<div class="columns">
<div>

### Good:

```ts
export async function GET(...) {
    // ...
    const hasAccess = await canAccessTodo(session.user.id, params.id);
    if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(todo: await db.todo.findUnique({ where: { id: params.id } }));
}
```

</div>
<div>

### Bad:

```ts
export async function GET(...) {
    return NextResponse.json(todo: await db.todo.findUnique({ where: { id: params.id } }));
}
```

</div>
</div>

---

## セットアップ

[ast-grep Playground](https://ast-grep.github.io/playground.html#eyJtb2RlIjoiUGF0Y2giLCJsYW5nIjoidHlwZXNjcmlwdCIsInF1ZXJ5IjoiY29uc29sZS4kRlVOQygkJCRBUkdTKTsiLCJyZXdyaXRlIjoiIiwic3RyaWN0bmVzcyI6InNtYXJ0Iiwic2VsZWN0b3IiOiIiLCJjb25maWciOiIjIFlBTUwgUnVsZSBpcyBtb3JlIHBvd2VyZnVsIVxuIyBodHRwczovL2FzdC1ncmVwLmdpdGh1Yi5pby9ndWlkZS9ydWxlLWNvbmZpZy5odG1sI3J1bGVcbnJ1bGU6XG4gIGFueTpcbiAgICAtIHBhdHRlcm46IGNvbnNvbGUubG9nKCRBKVxuICAgIC0gcGF0dGVybjogY29uc29sZS5kZWJ1ZygkQSlcbmZpeDpcbiAgbG9nZ2VyLmxvZygkQSkiLCJzb3VyY2UiOiJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgeyBkYiB9IGZyb20gXCIuLi8uLi8uLi8uLi9saWIvZGJcIjtcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyBoYXNQZXJtaXNzaW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2xpYi91dGlsc1wiO1xuaW1wb3J0IHsgUm9sZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9nZW5lcmF0ZWQvcHJpc21hXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGNhbkFjY2Vzc1RvZG8odXNlcklkOiBzdHJpbmcsIHRvZG9JZDogc3RyaW5nLCByb2xlOiBzdHJpbmcsIHRlbmFudElkOiBzdHJpbmcpIHtcbiAgY29uc3QgdG9kbyA9IGF3YWl0IGRiLnRvZG8uZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IHRvZG9JZCB9LFxuICB9KTtcblxuICBpZiAoIXRvZG8pIHJldHVybiBmYWxzZTtcblxuICBpZiAodG9kby50ZW5hbnRJZCAhPT0gdGVuYW50SWQpIHJldHVybiBmYWxzZTtcblxuICBpZiAocm9sZSA9PT0gUm9sZS5PV05FUiB8fCByb2xlID09PSBSb2xlLk1BTkFHRVIpIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiB0b2RvLnVzZXJJZCA9PT0gdXNlcklkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKFxuICByZXF1ZXN0OiBSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBpZDogc3RyaW5nIH0gfVxuKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvZG9JZCA9IHBhcmFtcy5pZDtcbiAgICBjb25zdCBoYXNBY2Nlc3MgPSBhd2FpdCBjYW5BY2Nlc3NUb2RvKFxuICAgICAgc2Vzc2lvbi51c2VyLmlkLFxuICAgICAgdG9kb0lkLFxuICAgICAgc2Vzc2lvbi51c2VyLnJvbGUsXG4gICAgICBzZXNzaW9uLnVzZXIudGVuYW50SWRcbiAgICApO1xuXG4gICAgaWYgKCFoYXNBY2Nlc3MpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkZvcmJpZGRlblwiIH0sIHsgc3RhdHVzOiA0MDMgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9kbyA9IGF3YWl0IGRiLnRvZG8uZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZDogdG9kb0lkIH0sXG4gICAgICBpbmNsdWRlOiB7XG4gICAgICAgIHVzZXI6IHtcbiAgICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICAgIGlkOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogdHJ1ZSxcbiAgICAgICAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCF0b2RvKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJUb2RvIG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHRvZG8pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyB0b2RvOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggdG9kb1wiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQQVRDSChcbiAgcmVxdWVzdDogUmVxdWVzdCxcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgaWQ6IHN0cmluZyB9IH1cbikge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2RvSWQgPSBwYXJhbXMuaWQ7XG4gICAgY29uc3QgaGFzQWNjZXNzID0gYXdhaXQgY2FuQWNjZXNzVG9kbyhcbiAgICAgIHNlc3Npb24udXNlci5pZCxcbiAgICAgIHRvZG9JZCxcbiAgICAgIHNlc3Npb24udXNlci5yb2xlLFxuICAgICAgc2Vzc2lvbi51c2VyLnRlbmFudElkXG4gICAgKTtcblxuICAgIGlmICghaGFzQWNjZXNzKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJGb3JiaWRkZW5cIiB9LCB7IHN0YXR1czogNDAzIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdGl0bGUsIGRlc2NyaXB0aW9uLCBjb21wbGV0ZWQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gICAgY29uc3QgdXBkYXRlZFRvZG8gPSBhd2FpdCBkYi50b2RvLnVwZGF0ZSh7XG4gICAgICB3aGVyZTogeyBpZDogdG9kb0lkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLih0aXRsZSAhPT0gdW5kZWZpbmVkID8geyB0aXRsZSB9IDoge30pLFxuICAgICAgICAuLi4oZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCA/IHsgZGVzY3JpcHRpb24gfSA6IHt9KSxcbiAgICAgICAgLi4uKGNvbXBsZXRlZCAhPT0gdW5kZWZpbmVkID8geyBjb21wbGV0ZWQgfSA6IHt9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odXBkYXRlZFRvZG8pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB1cGRhdGluZyB0b2RvOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gdXBkYXRlIHRvZG9cIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKFxuICByZXF1ZXN0OiBSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBpZDogc3RyaW5nIH0gfVxuKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvZG9JZCA9IHBhcmFtcy5pZDtcbiAgICAvLyBidWchXG4gICAgLy8gY29uc3QgaGFzQWNjZXNzID0gYXdhaXQgY2FuQWNjZXNzVG9kbyhcbiAgICAvLyAgIHNlc3Npb24udXNlci5pZCxcbiAgICAvLyAgIHRvZG9JZCxcbiAgICAvLyAgIHNlc3Npb24udXNlci5yb2xlLFxuICAgIC8vICAgc2Vzc2lvbi51c2VyLnRlbmFudElkXG4gICAgLy8gKTtcblxuICAgIC8vIGlmICghaGFzQWNjZXNzKSB7XG4gICAgLy8gICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJGb3JiaWRkZW5cIiB9LCB7IHN0YXR1czogNDAzIH0pO1xuICAgIC8vIH1cblxuICAgIGF3YWl0IGRiLnRvZG8uZGVsZXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiB0b2RvSWQgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiVG9kbyBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZWxldGluZyB0b2RvOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gZGVsZXRlIHRvZG9cIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuIn0=) を開き、問題のあるコードを検出するルールを書いてみましょう！

サンプルコードの概要:
- `GET` メソッド、`PATCH` メソッドは `canXXX` を呼び出している✅
- `DELETE` メソッドは `canXXX` を呼び出し忘れている！⚠️

🎙️: うまく動くルールのデモ

---

## 注意点

このリポジトリにはサンプルアプリケーションが含まれていますが、`public/sampleapp/src/app/api/todos/[id]/route.ts` 以外はこのハンズオンでは使いません。

---

## Next

- ガイドに沿って一歩ずつ進めたい人: [こちら](./02-01-overview.md)
- ノーヒントで頑張りたい人: 💪

終わったら: [発展編](./03-advanced.md)
