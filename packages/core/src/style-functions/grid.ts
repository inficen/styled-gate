import { system } from "../system"

const defaults = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
}

export const grid = system({
  gridGap: {
    cssProperty: "gridGap",
    scale: "space",
    defaultScale: defaults.space,
  },
  gridColumnGap: {
    cssProperty: "gridColumnGap",
    scale: "space",
    defaultScale: defaults.space,
  },
  gridRowGap: {
    cssProperty: "gridRowGap",
    scale: "space",
    defaultScale: defaults.space,
  },
  gridColumn: true,
  gridRow: true,
  gridAutoFlow: true,
  gridAutoColumns: true,
  gridAutoRows: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
  gridTemplateAreas: true,
  gridArea: true,
})
