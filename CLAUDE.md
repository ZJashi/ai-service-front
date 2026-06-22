@AGENTS.md

# React 19 conventions

- `React.FormEvent` / `FormEventHandler` are deprecated in React 19. Avoid typing submit handlers with any event type.
  Instead, use an inline arrow on `onSubmit` for `preventDefault` and pass `FormData` directly to a plain function:
  ```tsx
  function handleSubmit(data: FormData) { ... }

  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }}>
  ```
  TypeScript infers `e` correctly from context; `handleSubmit` stays free of event types entirely.
