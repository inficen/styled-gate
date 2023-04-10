import { system } from "../system"

export const color = system({
  color: {
    cssProperty: "color",
    scale: "colors",
  },
  backgroundColor: {
    cssProperty: "backgroundColor",
    scale: "colors",
    alias: "bg",
  },
  opacity: true,
})
