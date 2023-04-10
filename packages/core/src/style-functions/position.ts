import { system, SystemProps } from "../system"

const defaults = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
}

export const position = system({
  position: true,
  zIndex: {
    cssProperty: "zIndex",
    scale: "zIndices",
  },
  top: {
    cssProperty: "top",
    scale: "space",
    defaultScale: defaults.space,
  },
  right: {
    cssProperty: "right",
    scale: "space",
    defaultScale: defaults.space,
  },
  bottom: {
    cssProperty: "bottom",
    scale: "space",
    defaultScale: defaults.space,
  },
  left: {
    cssProperty: "left",
    scale: "space",
    defaultScale: defaults.space,
  },
})

export type PositionProps = SystemProps<typeof position>