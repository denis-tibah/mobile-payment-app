import { Children } from "react"
import Box from "../Box"

export function Stack({ children, spacing = 1, direction = "column" }:any) {
  const getSpacing = spacing * 8
  const totalChildren = Children.count(children)
  return (
    <Box flexDirection={direction}>
      {Children.map(children, (child) => (
        <Box
          marginLeft={
            direction === "row" &&
              totalChildren > 1 ? getSpacing : null
          }
          marginTop={
            direction === "column" &&
              totalChildren > 1 ? getSpacing : null
          }
        >
          {child}
        </Box>
      ))}
    </Box>
  )
}
