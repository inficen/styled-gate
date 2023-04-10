import { system, SystemProps } from "../system"

export const color = system({
  color: {
    cssProperty: "color",
    scale: "colors",
  },
  backgroundColor: {
    cssProperty: "backgroundColor",
    scale: "colors",
  },
  bg: "backgroundColor",
  opacity: true,
})

export type ColorProps = SystemProps<typeof color>
