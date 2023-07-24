import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function ArrowRight({ size = 14, color = "pink", style }: any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
      style={style}
    >
      <Path
        d="M3 1.645L7.94467 7L3 12.355L4.52227 14L11 7L4.52227 0L3 1.645Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
