import { Properties } from "csstype"

type CssKey = keyof Properties

export type SystemConfig = Record<
  string,
  // Full config object
  | Omit<CreateStyleFunctionInput, "propName">
  // prop name matches css property
  | boolean
  // single alias shorthand
  | string
  // multiple alias shorthand
  | Array<string>
>

export function system<T extends SystemConfig>(config: T): StyleFunction {
  const styleFunctionMap: Record<string, StyleFunction> = {}

  const styleFunctions = Object.entries(config).map(([propName, config]) => {
    const verboseConfig =
      typeof config === "boolean"
        ? { propName, cssProperty: propName as CssKey }
        : typeof config === "string" || Array.isArray(config)
        ? {
            propName,
            cssProperty: propName as CssKey,
            alias: config,
          }
        : {
            ...config,
            propName,
          }

    const styleFn = createStyleFunction(verboseConfig)
    styleFunctionMap[propName] = styleFn
    const { alias } = verboseConfig
    const aliases = alias ? (Array.isArray(alias) ? alias : [alias]) : []
    aliases.forEach((alias) => {
      styleFunctionMap[alias] = styleFn
    })
  })

  return createParser(styleFunctionMap)
}

type CreateParserConfig = Record<string, StyleFunction>

function createParser(config: CreateParserConfig) {
  const parser = (props: StyledFunctionProps) => {
    return Object.keys(props).reduce((styles, propName) => {
      const styleFn = config[propName]
      if (styleFn) {
        styles = mergeStyles(styles, styleFn(props))
      }
      return styles
    }, {})
  }

  parser.config = config

  return parser
}

type StyleFunction = <T extends Record<string, unknown> = any>(
  input: StyledFunctionProps<T>
) => Styles

type StyledFunctionProps<T extends Record<string, unknown> = any> = {
  theme?: Theme
} & T

type CreateStyleFunctionInput = {
  propName: string
  cssProperty?: CssKey | CssKey[]
  scale?: string
  transform?: (value: string | number, scale: string, props: any) => string
  defaultScale?: Array<unknown>
  alias?: string | Array<string>
}

const getValue = (n: string | number, scale: any) => get(scale, n, n)

export function createStyleFunction({
  defaultScale,
  propName,
  cssProperty,
  scale: _scale,
  transform = getValue,
  alias,
}: CreateStyleFunctionInput): StyleFunction {
  return (props: StyledFunctionProps) => {
    const scale = _scale ? props.theme?.[_scale] ?? defaultScale : defaultScale
    const allBreakpoints = props.theme?.breakpoints ?? themeDefaults.breakpoints
    const allPropNames = [propName, ...(Array.isArray(alias) ? alias : [alias])]
    const value: any =
      props[allPropNames.find((propName) => props[propName] !== undefined)]

    const cssKeys = cssProperty
      ? Array.isArray(cssProperty)
        ? cssProperty
        : [cssProperty]
      : []

    const styles: Styles = {}
    const addRootStyle = (path: string | number) => {
      const styleValue = transform(path, scale, props)
      cssKeys.forEach((key) => {
        if (isNotNil(styleValue)) {
          styles[key] = styleValue
        }
      })
    }

    if (value && typeof value === "object") {
      const normalizedBreakpoints = normalizeBreakpointStyles(
        value,
        allBreakpoints
      )
      if (normalizedBreakpoints) {
        normalizedBreakpoints.map(({ breakpoint, value }) => {
          if (breakpoint === "DEFAULT") {
            addRootStyle(value)
          } else {
            const nestedStyles: ObjectStyles = {}
            const styleValue = transform(value, scale, props)
            cssKeys.forEach((key) => {
              if (isNotNil(styleValue)) {
                nestedStyles[key] = styleValue
              }
            })

            styles[getBreakpointMediaQuery(breakpoint)] = nestedStyles
          }
        })
      }
    } else {
      addRootStyle(value)
    }

    return styles
  }
}

type Styles = Record<string, string | number | ObjectStyles>

type ObjectStyles = Record<string, string | number>

function normalizeBreakpointStyles(
  styles: Array<string | number> | Record<string, string | number>,
  breakpoints: any
): Array<{ breakpoint: string | "DEFAULT"; value: string | number }> {
  return Object.keys(styles).map((key) =>
    Array.isArray(styles)
      ? {
          breakpoint:
            key === "0"
              ? "DEFAULT"
              : getBreakpointValue(breakpoints, parseInt(key) - 1),
          value: (styles as any)[key],
        }
      : {
          breakpoint:
            key === "_" ? "DEFAULT" : getBreakpointValue(breakpoints, key),
          value: (styles as any)[key],
        }
  )
}

function getBreakpointValue(
  breakpoints: Breakpoints,
  key: string | number
): string {
  return Array.isArray(breakpoints)
    ? breakpoints[key as number]
    : breakpoints[key]
}

type Theme = {
  breakpoints?: Breakpoints
}

type Breakpoints = Array<string> | Record<string, string>

const themeDefaults = {
  breakpoints: ["40em", "52em", "64em"] satisfies Breakpoints,
} as const

function getBreakpointMediaQuery(value: string): string {
  return `@media screen and (min-width: ${value})`
}

export function get(
  obj: Record<string, any>,
  key: string | number,
  defaultValue: any
): any {
  return (
    `${key}`.split(".").reduce((val, key) => val?.[key], obj) ?? defaultValue
  )
}

const themeGet =
  (path: string, fallback: any = null) =>
  (props: any) =>
    get(props.theme, path, fallback)

function mergeStyles(existingStyles: Styles, newStyles: Styles): Styles {
  const mergedStyles = { ...existingStyles }
  Object.entries(newStyles).map(([key, value]) => {
    const mergedStyleValue = mergedStyles[key]
    if (mergedStyleValue && typeof mergedStyleValue === "object") {
      if (value && typeof value === "object") {
        mergedStyles[key] = { ...mergedStyleValue, ...value }
      }
    } else {
      mergedStyles[key] = value
    }
  })

  return mergedStyles
}

function isNotNil<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null
}

export function compose(...styleFunctions: StyleFunction[]): StyleFunction {
  return (props: StyledFunctionProps) =>
    styleFunctions.reduce((styles, fn) => mergeStyles(styles, fn(props)), {})
}
