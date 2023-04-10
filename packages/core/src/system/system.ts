type SystemInput = Record<
  string,
  Omit<CreateStyleFunctionInput, "propName"> | boolean
>

export const system = <T extends SystemInput>(config: T): StyleFunction => {
  const styleFunctions = Object.entries(config).map(([propName, config]) =>
    typeof config === "boolean"
      ? createStyleFunction({ propName, cssProperty: propName })
      : createStyleFunction({
          ...config,
          propName,
        })
  )

  return (props: StyledFunctionProps) =>
    styleFunctions.reduce((styles, fn) => {
      return mergeStyles(styles, fn(props))
    }, {})
}

type Styles = Record<string, string | number | ObjectStyles>

type ObjectStyles = Record<string, string | number>

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

type SystemFunction<T extends SystemInput> = (props: {
  [K in keyof T]?: string | number
}) => Record<string, unknown>

type StyleFunction = <T extends Record<string, unknown> = any>(
  input: StyledFunctionProps<T>
) => Styles

type StyledFunctionProps<T extends Record<string, unknown> = any> = {
  theme?: Theme
} & T

type CreateStyleFunctionInput = {
  propName: string
  cssProperty?: string | string[]
  scale?: string
  transform?: (value: string, scale: string) => string
  defaultScale?: string[]
}

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

export const createStyleFunction = ({
  defaultScale,
  propName,
  cssProperty,
  scale,
  transform,
}: CreateStyleFunctionInput): StyleFunction => {
  return ({ theme = themeDefaults, ...props }: StyledFunctionProps) => {
    const allBreakpoints = theme?.breakpoints ?? themeDefaults.breakpoints
    const value: any = props[propName]

    const cssKeys = cssProperty
      ? Array.isArray(cssProperty)
        ? cssProperty
        : [cssProperty]
      : []

    const styles: Styles = {}
    const addRootStyle = (path: string, defaultValue: any) => {
      const styleValue = get(theme, path, defaultValue)
      cssKeys.forEach((key) => {
        if (styleValue !== null) {
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
            addRootStyle(`${scale}.${value}`, value)
          } else {
            const nestedStyles: ObjectStyles = {}
            const styleValue = get(theme, `${scale}.${value}`, value)
            cssKeys.forEach((key) => {
              if (styleValue !== null) {
                nestedStyles[key] = styleValue
              }
            })

            styles[getBreakpointMediaQuery(breakpoint)] = nestedStyles
          }
        })
      }
    } else {
      addRootStyle(`${scale}.${value}`, value)
    }

    return styles
  }
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

const get = (obj: Record<string, any>, key: string, defaultValue: any): any =>
  key.split(".").reduce((val, key) => val?.[key], obj) ?? defaultValue
