# arc-client

[![NPM version](https://img.shields.io/npm/v/@prsm/arc-client?color=a1b858&label=)](https://www.npmjs.com/package/@prsm/arc-client)

arc-client uses [`@prsm/duplex`](https://github.com/node-prism/duplex) in order to communicate with a [`@prsm/arc-server`](https://github.com/node-prism/arc-server) over TCP.

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

// try to authenticate using the provided username and password
// returns true if successful, false if not
const success = await arc.auth();

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

Use `collectionWrapper(collectionName: string)` to receive a more simplified API if your collection name doesn't change over time. This provides the same API as a standard `@prsm/arc` `Collection`, with the one exception being that this interface is async.

```typescript
const planets = arc.collectionWrapper("planets");

await planets.drop();
await planets.insert([{ name: "Mercury" }, { name: "Venus" }, { name: "Earth" }, { name: "Mars" }]);
await planets.find({ name: { $includes: "M" } });
```

## Events

```typescript
// authentication failure, error includes reason
arc.emitter.on("autherror", (error: string) => {});

// authentication was a success
arc.emitter.on("authsuccess", () => {});
```

## Handling the connection

To disconnect an active session, call `close` on the client:

```typescript
arc.close();
```

After closing the connection, you can reconnect by calling `connect`:

```typescript
arc.connect();

// you will need to reauthenticate at this point
await arc.auth();
```
