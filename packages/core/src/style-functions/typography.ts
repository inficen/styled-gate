import { system, SystemProps } from "../system"

const defaults = {
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
}

export const typography = system({
  fontFamily: {
    cssProperty: "fontFamily",
    scale: "fonts",
  },
  fontSize: {
    cssProperty: "fontSize",
    scale: "fontSizes",
    defaultScale: defaults.fontSizes,
  },
  fontWeight: {
    cssProperty: "fontWeight",
    scale: "fontWeights",
  },
  lineHeight: {
    cssProperty: "lineHeight",
    scale: "lineHeights",
  },
  letterSpacing: {
    cssProperty: "letterSpacing",
    scale: "letterSpacings",
  },
  textAlign: true,
  fontStyle: true,
})

export type TypographyProps = SystemProps<typeof typography>
