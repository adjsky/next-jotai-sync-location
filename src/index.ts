import Router from "next/router"
import { atomWithStorage, RESET } from "jotai/utils"

import type { WritableAtom, SetStateAction } from "jotai"
import type { UrlObject } from "url"

const push = (url: UrlObject) =>
  Router.push(url, undefined, {
    scroll: false
  })

const replace = (url: UrlObject) =>
  Router.replace(url, undefined, {
    scroll: false
  })

const atomWithLocation = <T>(
  key: string,
  initialValue: T,
  options?: {
    delayInit?: boolean
    replaceState?: boolean
    serialize?: (value: T) => string | string[]
    deserialize?: (value: string | string[]) => any
  }
): WritableAtom<T, SetStateAction<T> | typeof RESET> => {
  const _serialize = (value: T) =>
    Array.isArray(value)
      ? value.map((item) => JSON.stringify(item))
      : JSON.stringify(value)
  const _deserialize = (value: string | string[]) =>
    Array.isArray(value)
      ? value.map((item) => JSON.parse(item))
      : JSON.parse(value)

  const serialize = options?.serialize ?? _serialize
  const deserialize = options?.deserialize ?? _deserialize

  return atomWithStorage(key, initialValue, {
    getItem: (key) => {
      const value = Router.query[key]

      if (value === undefined) {
        throw new Error("no value stored")
      }

      return deserialize(value)
    },
    setItem: (key, newValue) => {
      const url = {
        pathname: Router.pathname,
        query: {
          ...Router.query,
          [key]: serialize(newValue)
        }
      }

      options?.replaceState ? replace(url) : push(url)
    },
    removeItem: (key) => {
      const query = { ...Router.query }

      delete query[key]

      const url = {
        pathname: Router.pathname,
        query
      }

      options?.replaceState ? replace(url) : push(url)
    },
    subscribe: (key, setValue) => {
      const callback = () => {
        const value = Router.query[key]

        if (value !== undefined) {
          setValue(deserialize(value))
        } else {
          setValue(initialValue)
        }
      }

      Router.events.on("routeChangeComplete", callback)

      return () => {
        Router.events.off("routeChangeComplete", callback)
      }
    },
    ...(options?.delayInit && { delayInit: true })
  })
}

export default atomWithLocation
