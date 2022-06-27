import Router from "next/router"
import React from "react"
import { useAtom } from "jotai"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import atomWithLocation from "../src"

jest.mock("next/router", () => require("next-router-mock"))

const anAtom = atomWithLocation("atom", 5)

const Component = ({ valueToSet }: { valueToSet: number }) => {
  const [_, setAtom] = useAtom(anAtom)

  return <button onClick={() => setAtom(valueToSet)}>set atom value</button>
}

describe("functionality", () => {
  it("adds query key in url on change", async () => {
    const user = userEvent.setup()
    const valueToSet = Math.random()

    render(<Component valueToSet={valueToSet} />)

    await user.click(screen.getByText(/set atom value/i))

    expect(Router.query.atom).toBe(valueToSet.toString())
  })
})
