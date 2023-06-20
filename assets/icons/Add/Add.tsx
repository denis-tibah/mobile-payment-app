import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Add({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      fill={getColor(color) || color}
      viewBox="0 0 14 14"
    >
      <Path
        d="M7.7 3.5H6.3V6.3H3.5V7.7H6.3V10.5H7.7V7.7H10.5V6.3H7.7V3.5ZM7 0C3.136 0 0 3.136 0 7C0 10.864 3.136 14 7 14C10.864 14 14 10.864 14 7C14 3.136 10.864 0 7 0ZM7 12.6C3.913 12.6 1.4 10.087 1.4 7C1.4 3.913 3.913 1.4 7 1.4C10.087 1.4 12.6 3.913 12.6 7C12.6 10.087 10.087 12.6 7 12.6Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
