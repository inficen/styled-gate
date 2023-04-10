import { system, SystemProps } from "../system"

export const border = system({
  borderTopWidth: {
    cssProperty: "borderTopWidth",
    scale: "borderWidths",
  },
  borderTopColor: {
    cssProperty: "borderTopColor",
    scale: "colors",
  },
  borderTopStyle: {
    cssProperty: "borderTopStyle",
    scale: "borderStyles",
  },
  borderTopLeftRadius: {
    cssProperty: "borderTopLeftRadius",
    scale: "radii",
  },
  borderTopRightRadius: {
    cssProperty: "borderTopRightRadius",
    scale: "radii",
  },
  borderBottomWidth: {
    cssProperty: "borderBottomWidth",
    scale: "borderWidths",
  },
  borderBottomColor: {
    cssProperty: "borderBottomColor",
    scale: "colors",
  },
  borderBottomStyle: {
    cssProperty: "borderBottomStyle",
    scale: "borderStyles",
  },
  borderBottomLeftRadius: {
    cssProperty: "borderBottomLeftRadius",
    scale: "radii",
  },
  borderBottomRightRadius: {
    cssProperty: "borderBottomRightRadius",
    scale: "radii",
  },
  borderLeftWidth: {
    cssProperty: "borderLeftWidth",
    scale: "borderWidths",
  },
  borderLeftColor: {
    cssProperty: "borderLeftColor",
    scale: "colors",
  },
  borderLeftStyle: {
    cssProperty: "borderLeftStyle",
    scale: "borderStyles",
  },
  borderRightWidth: {
    cssProperty: "borderRightWidth",
    scale: "borderWidths",
  },
  borderRightColor: {
    cssProperty: "borderRightColor",
    scale: "colors",
  },
  borderRightStyle: {
    cssProperty: "borderRightStyle",
    scale: "borderStyles",
  },
  border: {
    cssProperty: "border",
    scale: "borders",
  },
  borderWidth: {
    cssProperty: "borderWidth",
    scale: "borderWidths",
  },
  borderStyle: {
    cssProperty: "borderStyle",
    scale: "borderStyles",
  },
  borderColor: {
    cssProperty: "borderColor",
    scale: "colors",
  },
  borderRadius: {
    cssProperty: "borderRadius",
    scale: "radii",
  },
  borderTop: {
    cssProperty: "borderTop",
    scale: "borders",
  },
  borderRight: {
    cssProperty: "borderRight",
    scale: "borders",
  },
  borderBottom: {
    cssProperty: "borderBottom",
    scale: "borders",
  },
  borderLeft: {
    cssProperty: "borderLeft",
    scale: "borders",
  },
  borderX: {
    cssProperty: ["borderLeft", "borderRight"],
    scale: "borders",
  },
  borderY: {
    cssProperty: ["borderTop", "borderBottom"],
    scale: "borders",
  },
})

export type BorderProps = SystemProps<typeof border>
