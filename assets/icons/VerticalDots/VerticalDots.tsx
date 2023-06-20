import { getColor } from "../color";
import Svg, { Path, Circle } from "react-native-svg";
export function VerticalDots({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Circle
        cx="6.90909"
        cy="1.90909"
        r="1.90909"
        fill={getColor(color) || color}
      />
      <Circle
        cx="6.90909"
        cy="6.99991"
        r="1.90909"
        fill={getColor(color) || color}
      />
      <Circle
        cx="6.90909"
        cy="12.0907"
        r="1.90909"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
