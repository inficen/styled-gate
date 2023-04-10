import * as CSS from "csstype"

export type ObjectOrArray<T, K extends keyof any = keyof any> =
  | T[]
  | Record<K, T | Record<K, T> | T[]>

export type TLengthStyledSystem = string | 0 | number

export type RequiredTheme = Required<Theme>

type NestedKeyOf<ObjectType extends Record<string, any>> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Record<
    string,
    any
  >
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type ThemeValue<
  ThemeType extends Record<string, any>,
  K extends keyof ThemeType
> = ThemeType[K] extends unknown[]
  ? number
  : ThemeType[K] extends Record<string, unknown>
  ? NestedKeyOf<ThemeType[K]>
  : ThemeType[K] extends ObjectOrArray<infer F>
  ? F
  : never

export type ResponsiveValue<T, ThemeType extends Theme = RequiredTheme> =
  | T
  | null
  | Array<T | null>
  | {
      [key in
        | ((ThemeValue<ThemeType, "breakpoints"> | "_") & string)
        | number]?: T
    }

export interface Theme<TLength = TLengthStyledSystem> {
  breakpoints?: ObjectOrArray<number | string | symbol> | undefined
  mediaQueries?: { [size: string]: string } | undefined
  space?: ObjectOrArray<CSS.Property.Margin<number | string>> | undefined
  fontSizes?: ObjectOrArray<CSS.Property.FontSize<number>> | undefined
  colors?: ObjectOrArray<CSS.Property.Color> | undefined
  fonts?: ObjectOrArray<CSS.Property.FontFamily> | undefined
  fontWeights?: ObjectOrArray<CSS.Property.FontWeight> | undefined
  lineHeights?: ObjectOrArray<CSS.Property.LineHeight<TLength>> | undefined
  letterSpacings?:
    | ObjectOrArray<CSS.Property.LetterSpacing<TLength>>
    | undefined
  sizes?:
    | ObjectOrArray<CSS.Property.Height<{}> | CSS.Property.Width<{}>>
    | undefined
  borders?: ObjectOrArray<CSS.Property.Border<{}>> | undefined
  borderStyles?: ObjectOrArray<CSS.Property.Border<{}>> | undefined
  borderWidths?: ObjectOrArray<CSS.Property.BorderWidth<TLength>> | undefined
  radii?: ObjectOrArray<CSS.Property.BorderRadius<TLength>> | undefined
  shadows?: ObjectOrArray<CSS.Property.BoxShadow> | undefined
  zIndices?: ObjectOrArray<CSS.Property.ZIndex> | undefined
  buttons?: ObjectOrArray<CSS.StandardProperties> | undefined
  colorStyles?: ObjectOrArray<CSS.StandardProperties> | undefined
  textStyles?: ObjectOrArray<CSS.StandardProperties> | undefined
}
