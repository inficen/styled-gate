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

import * as CSS from "csstype"
import { RequiredTheme, ResponsiveValue, ThemeValue } from "../theme"

type Color = CSS.Globals | CSS.DataType.NamedColor | "currentColor"

export type ColorProps<ThemeType extends Record<string, any> = RequiredTheme> =
  {
    color?: ResponsiveValue<ThemeValue<ThemeType, "colors"> | Color, ThemeType>
    backgroundColor?: ResponsiveValue<
      ThemeValue<ThemeType, "colors"> | Color,
      ThemeType
    >
    bg?: ResponsiveValue<ThemeValue<ThemeType, "colors"> | Color, ThemeType>
    opacity?: ResponsiveValue<CSS.Property.Opacity, ThemeType>
  }
