import { getColor } from "../color";
import Svg, { Path, Circle } from "react-native-svg"
export function Camera({ size = 24, color }:any) {
  return (
    <Svg
      viewBox="0 0 34 34"
      width={size}
      height={size}
      fill={getColor(color) || color}
    >
      <Circle cx={17} cy={17} r={17}
        fill={getColor('light-blue') || color}
      />
      <Path
        fill={getColor(color) || color}
        d="m20.3 13.22-.81-2.24h-5l-.78 2.22h-3.7v9.78H24v-9.79l-3.7.03zm2.13 8.18H11.57v-6.59h3.23l.77-2.22h2.86l.88 2.22h3.12v6.59z" />
      <Path
        fill={getColor(color) || color}
        d="M18.92 15.72a2.681 2.681 0 0 0-3.84 0 2.738 2.738 0 0 0-.79 1.95 2.78 2.78 0 0 0 .79 2 2.68 2.68 0 0 0 3.84 0 2.78 2.78 0 0 0 .79-2 2.74 2.74 0 0 0-.79-1.95zm-1.11 2.77a1.13 1.13 0 0 1-1.25.25 1.15 1.15 0 0 1-.7-1.07 1.17 1.17 0 0 1 .7-1.077A1.15 1.15 0 0 1 17 16.5a1.16 1.16 0 0 1 1.123 1.392 1.19 1.19 0 0 1-.313.598z" />
    </Svg>

  );
}

