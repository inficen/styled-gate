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
      return {
        ...styles,
        ...fn(props),
      }
    }, {})
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

export const createStyleFunction = ({
  defaultScale,
  propName,
  cssProperty,
  scale,
  transform,
}: CreateStyleFunctionInput): StyleFunction => {
  return ({ theme, ...props }: Record<string, unknown>) => {
    const value = props[propName]

    const cssKeys = Array.isArray(cssProperty) ? cssProperty : [cssProperty]

    const styles = {}

    if (Array.isArray(value)) {
      value.map((val, index) => {
        if (index === 0) {
          cssKeys.forEach((key) => {
            const styleValue = get(theme, `${scale}.${val}`, val)
            styles[key] = styleValue
          })
        } else {
          const breakpoint = themeDefaults.breakpoints[index - 1]
          const nestedStyles = {}
          cssKeys.forEach((key) => {
            const styleValue = get(theme, `${scale}.${val}`, val)
            nestedStyles[key] = styleValue
          })

          styles[`@media screen and (min-width: ${breakpoint})`] = nestedStyles
        }
      })
    } else {
      cssKeys.forEach((key) => {
        const styleValue = get(theme, `${scale}.${value}`, value)
        styles[key] = styleValue
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
