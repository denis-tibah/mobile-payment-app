import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function ArrowLeft({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 8 12"
      fill={getColor(color) || color}
    >
      <Path
        d="M7.6001 1.40999L3.1499 5.99999L7.6001 10.59L6.23006 12L0.400098 5.99999L6.23006 -7.62939e-06L7.6001 1.40999Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
