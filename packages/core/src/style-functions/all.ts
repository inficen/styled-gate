import { compose } from "../system"
import { background, BackgroundProps } from "./background"
import { border, BorderProps } from "./border"
import { ColorProps, color } from "./color"
import { FlexboxProps, flexbox } from "./flexbox"
import { GridProps, grid } from "./grid"
import { LayoutProps, layout } from "./layout"
import { PositionProps, position } from "./position"
import { ShadowProps, shadow } from "./shadow"
import { SpaceProps, space } from "./space"
import { TypographyProps, typography } from "./typography"

export const allProps = compose(
  background,
  border,
  color,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography
)

export type AllProps = BackgroundProps &
  BorderProps &
  ColorProps &
  FlexboxProps &
  GridProps &
  LayoutProps &
  PositionProps &
  ShadowProps &
  SpaceProps &
  TypographyProps
