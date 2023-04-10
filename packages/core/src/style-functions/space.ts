import { get, system, compose } from "../system"

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
    alias: "m",
  },
  marginTop: {
    cssProperty: "marginTop",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
    alias: "mt",
  },
  marginRight: {
    cssProperty: "marginRight",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
    alias: "mr",
  },
  marginBottom: {
    cssProperty: "marginBottom",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
    alias: "mb",
  },
  marginLeft: {
    cssProperty: "marginLeft",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
    alias: "ml",
  },
  marginX: {
    cssProperty: ["marginLeft", "marginRight"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
    alias: "mx",
  },
  marginY: {
    cssProperty: ["marginTop", "marginBottom"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
    alias: "my",
  },
})

export const padding = system({
  padding: {
    cssProperty: "padding",
    scale: "space",
    defaultScale: defaults.space,
    alias: "p",
  },
  paddingTop: {
    cssProperty: "paddingTop",
    scale: "space",
    defaultScale: defaults.space,
    alias: "pt",
  },
  paddingRight: {
    cssProperty: "paddingRight",
    scale: "space",
    defaultScale: defaults.space,
    alias: "pr",
  },
  paddingBottom: {
    cssProperty: "paddingBottom",
    scale: "space",
    defaultScale: defaults.space,
    alias: "pb",
  },
  paddingLeft: {
    cssProperty: "paddingLeft",
    scale: "space",
    defaultScale: defaults.space,
    alias: "pl",
  },
  paddingX: {
    cssProperty: ["paddingLeft", "paddingRight"],
    scale: "space",
    defaultScale: defaults.space,
    alias: "px",
  },
  paddingY: {
    cssProperty: ["paddingTop", "paddingBottom"],
    scale: "space",
    defaultScale: defaults.space,
    alias: "py",
  },
})

export const space = compose(margin, padding)
