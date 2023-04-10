import { system, SystemProps } from "../system"

export const shadow = system({
  boxShadow: {
    cssProperty: "boxShadow",
    scale: "shadows",
  },
  textShadow: {
    cssProperty: "textShadow",
    scale: "shadows",
  },
})

export type ShadowProps = SystemProps<typeof shadow>
