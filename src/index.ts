import Router from "next/router"
import { atomWithStorage, RESET } from "jotai/utils"

import type { WritableAtom, SetStateAction } from "jotai"

type UrlQueryInput =
  | string
  | number
  | boolean
  | ReadonlyArray<string>
  | ReadonlyArray<number>
  | ReadonlyArray<boolean>
  | null

const atomWithLocation = (
  key: string,
  initialValue: UrlQueryInput,
  options?: {
    delayInit?: boolean
    replaceState?: boolean
  }
): WritableAtom<UrlQueryInput, SetStateAction<UrlQueryInput> | typeof RESET> =>
  atomWithStorage(key, initialValue, {
    getItem: (key) => {
      const value = Router.query[key]

      if (value === undefined) {
        throw new Error("no value stored")
      }

      return value
    },
    setItem: (key, newValue) => {
      const url = {
        pathname: Router.pathname,
        query: { ...Router.query, [key]: newValue }
      }

      options?.replaceState ? Router.replace(url) : Router.push(url)
    },
    removeItem: (key) => {
      const query = { ...Router.query }

      delete query[key]

      Router.push({
        pathname: Router.pathname,
        query
      })
    },
    subscribe: (key, setValue) => {
      const callback = () => {
        const value = Router.query[key]

        if (value !== undefined) {
          setValue(value)
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

export default atomWithLocation
