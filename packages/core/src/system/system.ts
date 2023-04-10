import { Properties as CssProperties } from "csstype"

type CssKey = keyof CssProperties

export type SystemConfig = Record<string | "cow", SystemConfigValue>

type SystemConfigValue =
  // Full config object
  | Omit<CreateStyleFunctionInput, "propName">
  // prop name matches css property
  | boolean
  // single alias shorthand
  | string

export function system<T extends SystemConfig>(config: Readonly<T>): Parser<T> {
  const styleFunctionMap: Record<string, StyleFunction> = {}

  function getConfig(propName: string): CreateStyleFunctionInput {
    const shortConfig = config[propName]
    if (typeof shortConfig === "string") {
      if (!config[shortConfig]) {
        throw Error(`Invalid alias [${propName}: ${shortConfig}]`)
      }
      return { ...getConfig(shortConfig), propName }
    }

    const verboseConfig: CreateStyleFunctionInput =
      typeof shortConfig === "boolean"
        ? { propName, cssProperty: propName as CssKey }
        : { ...shortConfig, propName }

    return verboseConfig
  }

  for (const propName of Object.keys(config)) {
    styleFunctionMap[propName] = createStyleFunction(getConfig(propName))
  }

  return createParser(styleFunctionMap)
}

type ParserConfig<T extends SystemConfig> = {
  [K in keyof T]: StyleFunction
}

export type Parser<T extends SystemConfig = any> = {
  (props: StyledFunctionProps): Styles
  config: ParserConfig<T>
}

type CreateParserConfig = Record<string, StyleFunction>

function createParser(config: CreateParserConfig): Parser {
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

type CreateStyleFunctionInput<T = any> = {
  propName: string
  cssProperty?: CssKey | CssKey[]
  scale?: string
  transform?: (value: StyleValue, scale: T, props: any) => StyleValue
  defaultScale?: Array<T>
}

const getValue = (n: StyleValue, scale: any) => get(scale, n, n)

export function createStyleFunction({
  defaultScale,
  propName,
  cssProperty,
  scale: _scale,
  transform = getValue,
}: CreateStyleFunctionInput): StyleFunction {
  return (props: StyledFunctionProps) => {
    const scale = _scale ? props.theme?.[_scale] ?? defaultScale : defaultScale
    const allBreakpoints = props.theme?.breakpoints ?? themeDefaults.breakpoints
    const value: any = props[propName]

    const cssKeys = cssProperty
      ? Array.isArray(cssProperty)
        ? cssProperty
        : [cssProperty]
      : []

    const styles: Styles = {}
    const addRootStyle = (path: StyleValue) => {
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

type StyleValue = string | number
type Key = string | number

type Styles = Record<string, StyleValue | ObjectStyles>

type ObjectStyles = Record<string, StyleValue>

function normalizeBreakpointStyles(
  styles: Array<StyleValue> | Record<string, StyleValue>,
  breakpoints: any
): Array<{ breakpoint: string | "DEFAULT"; value: StyleValue }> {
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

function getBreakpointValue(breakpoints: Breakpoints, key: Key): string {
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
  key: Key,
  defaultValue: any
): any {
  return (
    `${key}`.split(".").reduce((val, key) => val?.[key], obj) ?? defaultValue
  )
}

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

export function compose(...parsers: Parser[]): Parser {
  let config = {}

  for (const parser of parsers) {
    config = { ...config, ...parser.config }
  }

  return createParser(config)
}

const themeGet =
  (path: string, fallback: any = null) =>
  (props: any) =>
    get(props.theme, path, fallback)

export type SystemProps<R extends Parser | SystemConfig> = R extends Parser<
  infer T
>
  ? SystemPropsLogic<T>
  : R extends SystemConfig
  ? SystemPropsLogic<R>
  : never

type SystemPropsLogic<T extends SystemConfig> = Partial<{
  [K in keyof T]: ResolveAlias<T, K> extends boolean
    ? GetProps<ResolveAliasKey<T, K>>
    : GetCssProperty<ResolveAlias<T, K>> extends any[]
    ? string
    : GetProps<GetCssProperty<ResolveAlias<T, K>>>
}>

type GetProps<K> = K extends keyof CssProperties ? CssProperties[K] : never

type GetCssProperty<T> = T extends { cssProperty: unknown }
  ? T["cssProperty"]
  : never

type ResolveAliasKey<
  T extends SystemConfig,
  K extends keyof T
> = T[K] extends string ? ResolveAliasKey<T, T[K]> : K

type ResolveAlias<
  T extends SystemConfig,
  K extends keyof T
> = T[ResolveAliasKey<T, K>]
