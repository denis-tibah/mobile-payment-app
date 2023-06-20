import React from "react";
import { View } from "react-native";
export function Box({ children, sx, style, ...props }: any):any {
  if (style?.length) {
    console.error("Error: this prop only accepts type object");
    return;
  }
  return <View style={{ ...props, ...sx, ...style }}>{children}</View>;
}
