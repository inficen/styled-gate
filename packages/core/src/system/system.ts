type SystemInput = Record<
  string,
  Omit<CreateStyleFunctionInput, "propName"> | boolean
>

export const system = <T extends SystemInput>(config: T): SystemFunction<T> => {
  const styleFunctions = Object.entries(config).map(([propName, config]) =>
    typeof config === "boolean"
      ? createStyleFunction({ propName, cssProperty: propName })
      : createStyleFunction({
          ...config,
          propName,
        })
  )

  return (props) =>
    styleFunctions.reduce((styles, fn) => {
      return mergeStyles(styles, fn(props))
    }, {})
}

function mergeStyles(existingStyles, newStyles) {
  const mergedStyles = { ...existingStyles }
  Object.entries(newStyles).map(([key, value]) => {
    if (mergedStyles[key] && typeof mergedStyles[key] === "object") {
      if (value && typeof value === "object") {
        mergedStyles[key] = { ...mergedStyles[key], ...value }
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

type StyleFunction = <Keys>(input: {
  theme?: Record<string, unknown>
}) => Record<string, unknown>

type CreateStyleFunctionInput = {
  propName: string
  cssProperty?: string | string[]
  scale?: string
  transform?: (value: string, scale: string) => string
  defaultScale?: string[]
}

function normalizeBreakpointStyles(
  styles: Array<string | number> | Record<string | number, string | number>,
  breakpoints: any
): Array<{ breakpoint: string; value: string | number }> {
  if (Array.isArray(styles)) {
    return styles.map((val, index) => {})
  }
  return []
}

export const createStyleFunction = ({
  defaultScale,
  propName,
  cssProperty,
  scale,
  transform,
}: CreateStyleFunctionInput): StyleFunction => {
  return ({ theme, ...props }: Record<string, unknown>) => {
    const allBreakpoints = theme?.breakpoints ?? themeDefaults.breakpoints
    const value = props[propName]

    const cssKeys = Array.isArray(cssProperty) ? cssProperty : [cssProperty]

    const styles = {}

    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        value.map((val, index) => {
          if (index === 0) {
            cssKeys.forEach((key) => {
              const styleValue = get(theme, `${scale}.${val}`, val)
              if (styleValue !== null) {
                styles[key] = styleValue
              }
            })
          } else {
            const breakpoint = allBreakpoints[index - 1]
            const nestedStyles = {}
            cssKeys.forEach((key) => {
              const styleValue = get(theme, `${scale}.${val}`, val)
              if (styleValue !== null) {
                nestedStyles[key] = styleValue
              }
            })

            styles[getBreakpointMediaQuery(breakpoint)] = nestedStyles
          }
        })
      } else {
        Object.entries(value).map(([breakpointKey, val]) => {
          console.log({ breakpointKey, val, cssKeys })
          if (breakpointKey === "_") {
            cssKeys.forEach((key) => {
              const styleValue = get(theme, `${scale}.${val}`, val)
              if (styleValue !== null) {
                styles[key] = styleValue
              }
            })
          } else {
            const breakpoint = allBreakpoints[breakpointKey]
            const nestedStyles = {}
            cssKeys.forEach((key) => {
              const styleValue = get(theme, `${scale}.${val}`, val)
              console.log(styleValue)
              if (styleValue !== null) {
                nestedStyles[key] = styleValue
              }
            })

            styles[getBreakpointMediaQuery(breakpoint)] = nestedStyles
          }
        })
      }
    } else {
      cssKeys.forEach((key) => {
        const styleValue = get(theme, `${scale}.${value}`, value)
        if (styleValue !== null) {
          styles[key] = styleValue
        }
      })
    }

    return styles
  }
}

export const get = (obj, key, def) => {
  key = key && key.split ? key.split(".") : [key]
  for (let p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undefined
  }
  return obj === undefined ? def : obj
}

const themeDefaults = {
  breakpoints: [40, 52, 64].map((n) => n + "em"),
}

function getBreakpointMediaQuery(value: string): string {
  return `@media screen and (min-width: ${value})`
}
