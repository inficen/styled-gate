import { background } from "./background"

test("returns background styles", () => {
  const style = background({ backgroundImage: "url(kitten.gif)" })
  expect(style).toEqual({ backgroundImage: "url(kitten.gif)" })
})

test("returns background alias styles", () => {
  const style = background({ bgImage: "url(kitten.gif)" })
  expect(style).toEqual({ backgroundImage: "url(kitten.gif)" })
})
