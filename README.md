# Sync [jotai](https://jotai.org/) atoms with [Next.js](https://nextjs.org/) router

## Why?

As dai-shi [mentioned](https://github.com/pmndrs/jotai/issues/1140#issuecomment-1118084148), there is no easy way to keep atoms in sync with window.location or the various available routers, so i wrote a simple wrapper over [atomWithStorage](https://jotai.org/docs/utils/atom-with-storage).

## Install

```bash
yarn add next-jotai-sync-location
```

or

```bash
npm install next-jotai-sync-location
```

## How to use

Method has the same signature as [atomWithHash](https://jotai.org/docs/utils/atom-with-hash), but you can't provide serialize / deserialize / subscribe.

```js
import atomWithLocation from "next-jotai-sync-location"

const countAtom = atomWithLocation("count", 0)
const countAtomWithReplace = atomWithLocation("count", 0, {
  replaceState: true
})
const countAtomWithoutDelay = atomWithLocation("count", 0, { delayInit: false })
```
