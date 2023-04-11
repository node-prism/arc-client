# arc-client

## Quickstart

```typescript
import { ArcClient } from "@prsm/arc-client";

const arc = new ArcClient({
  host: "localhost",
  port: 3351,
  secure: false,
  username: "root",
  password: "toor"
});

await arc.query({ collection: "planets", operation: "drop" });

await arc.query({
  collection: "planets",
  operation: "insert",
  data: {
    query: [
      { name: "Mercury" },
      { name: "Venus" },
      { name: "Earth" },
      { name: "Mars" }
    ],
  },
});

const result = await arc.query({
  collection: "planets",
  operation: "find",
  data: {
    query: { name: { $includes: "M" } },
  },
});

// [
//   {
//     name: 'Mercury',
//     _created_at: 1681253769538,
//     _updated_at: 1681253769538,
//     _id: 'a-lgcv332a-0cd148-c4-923c-4'
//   },
//   {
//     name: 'Mars',
//     _created_at: 1681253769539,
//     _updated_at: 1681253769539,
//     _id: 'a-lgcv332b-0cd14b-c7-923c-7'
//   }
// ]

```
