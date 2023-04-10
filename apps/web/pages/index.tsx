import styled, { ThemeProvider } from "styled-components"
import { Box } from "@styled-gate/styled-components"

export default function Web() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <h1>Web</h1>
        <Box bg={{ _: "blue", sm: "purple" }}>Box</Box>
      </div>
    </ThemeProvider>
  )
}

const theme = {
  breakpoints: { sm: "40em" },
  colors: {
    main: "blue",
    secondary: "red",
    blarg: "purple",
  },
}

type Theme = typeof theme

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
