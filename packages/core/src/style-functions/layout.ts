import { system, get, SystemProps } from "../system"

const isNumber = (n: unknown): n is number => typeof n === "number" && !isNaN(n)

const getWidth = (n: string | number, scale: any) =>
  get(scale, n, !isNumber(n) || n > 1 ? n : n * 100 + "%")

export const layout = system({
  width: {
    cssProperty: "width",
    scale: "sizes",
    transform: getWidth,
  },
  height: {
    cssProperty: "height",
    scale: "sizes",
  },
  minWidth: {
    cssProperty: "minWidth",
    scale: "sizes",
  },
  minHeight: {
    cssProperty: "minHeight",
    scale: "sizes",
  },
  maxWidth: {
    cssProperty: "maxWidth",
    scale: "sizes",
  },
  maxHeight: {
    cssProperty: "maxHeight",
    scale: "sizes",
  },
  size: {
    cssProperty: ["width", "height"],
    scale: "sizes",
  },
  overflow: true,
  overflowX: true,
  overflowY: true,
  display: true,
  verticalAlign: true,
})

export type LayoutProps = SystemProps<typeof layout>
