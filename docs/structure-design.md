# Structure Design

- api: divided by module
  - index.ts: network request
  - db.ts: database operation
  - **should not** rely on any other packages
- components: divided by page
- modules: main logic
  - common: shared utils
  - others: divided by module
- store: divided by module
  - **should** only rely type.ts or modules/common
