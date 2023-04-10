import { system, SystemProps } from "../system"

export const background = system({
  background: true,
  backgroundImage: true,
  bgImage: "backgroundImage",
  backgroundSize: true,
  bgSize: "backgroundSize",
  backgroundPosition: true,
  bgPosition: "backgroundPosition",
  backgroundRepeat: true,
  bgRepeat: "backgroundRepeat",
})

export type BackgroundProps = SystemProps<typeof background>
