# Structure Design

- components
  - children dir: divided by page
- modules: main ts logic
  - common: shared utils
  - others: named by function
    - types.ts: **only** hold types
    - hooks.ts: contains state, **only** used in components and other hooks
    - others: name by function
- store: jotai state
  - children dir: divided by page
    - index.ts: **should only** rely inside store
    - type.ts: **only** hold types
