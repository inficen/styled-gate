import { Box } from "@styled-gate/styled-components"

export default {
  title: "Styled Components/Box",
  component: Box,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
  },
}

export const Primary = {
  args: {
    primary: true,
    label: "Button",
  },
}

export const Secondary = {
  args: {
    label: "Button",
  },
}

export const Large = {
  args: {
    size: "large",
    label: "Button",
  },
}

export const Small = {
  args: {
    size: "small",
    label: "Button",
  },
}
