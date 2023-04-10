import styled, { DefaultTheme } from "styled-components"
import { boxProps, ColorProps } from "@styled-gate/core"
export type { BoxProps } from "@styled-gate/core"

export const Box = styled.div<ColorProps<DefaultTheme>>(boxProps)
