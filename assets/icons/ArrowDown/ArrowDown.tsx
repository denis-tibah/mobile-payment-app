import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function ArrowDown({ size = 14, color, style }:any) {
  return (
    <Svg
      width={size}
      height={size}
      fill={getColor(color) || color}
      style={style}
    >
      <Path
        width={size}
        height={size}
        fill={getColor(color) || color}
        d="M11.59 3.4 7 7.85 2.41 3.4 1 4.77l6 5.83 6-5.83-1.41-1.37z"
      />
    </Svg>
  );
}
