import { get, system, compose, SystemProps } from "../system"

const defaults = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
}

const isNumber = (n: unknown): n is number => typeof n === "number" && !isNaN(n)

const getMargin = (n: string | number, scale: number[]) => {
  if (!isNumber(n)) {
    return get(scale, n, n)
  }

  const isNegative = n < 0
  const absolute = Math.abs(n)
  const value = get(scale, absolute, absolute)
  if (!isNumber(value)) {
    return isNegative ? "-" + value : value
  }
  return value * (isNegative ? -1 : 1)
}

export const margin = system({
  margin: {
    cssProperty: "margin",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  m: "margin",
  marginTop: {
    cssProperty: "marginTop",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  mt: "marginTop",
  marginRight: {
    cssProperty: "marginRight",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  mr: "marginRight",
  marginBottom: {
    cssProperty: "marginBottom",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  mb: "marginBottom",
  marginLeft: {
    cssProperty: "marginLeft",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  ml: "marginLeft",
  marginX: {
    cssProperty: ["marginLeft", "marginRight"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  mx: "marginX",
  marginY: {
    cssProperty: ["marginTop", "marginBottom"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  my: "marginY",
})

export const padding = system({
  padding: {
    cssProperty: "padding",
    scale: "space",
    defaultScale: defaults.space,
  },
  p: "padding",
  paddingTop: {
    cssProperty: "paddingTop",
    scale: "space",
    defaultScale: defaults.space,
  },
  pt: "paddingTop",
  paddingRight: {
    cssProperty: "paddingRight",
    scale: "space",
    defaultScale: defaults.space,
  },
  pr: "paddingRight",
  paddingBottom: {
    cssProperty: "paddingBottom",
    scale: "space",
    defaultScale: defaults.space,
  },
  pb: "paddingBottom",
  paddingLeft: {
    cssProperty: "paddingLeft",
    scale: "space",
    defaultScale: defaults.space,
  },
  pl: "paddingLeft",
  paddingX: {
    cssProperty: ["paddingLeft", "paddingRight"],
    scale: "space",
    defaultScale: defaults.space,
  },
  px: "paddingX",
  paddingY: {
    cssProperty: ["paddingTop", "paddingBottom"],
    scale: "space",
    defaultScale: defaults.space,
  },
  py: "paddingY",
})

export const space = compose(margin, padding)

export type SpaceProps = SystemProps<typeof space>
