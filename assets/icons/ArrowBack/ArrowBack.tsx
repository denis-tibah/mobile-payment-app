import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";

export function ArrowBack({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M4.85039 11.664L0 6.83202L4.85039 2L6.08136 3.23097L3.34383 5.9685H14V7.69554H3.34383L6.08136 10.4331L4.85039 11.664Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
