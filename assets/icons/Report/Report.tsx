import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Report({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M7 3.45L11.7918 11.4386H2.20818L7 3.45ZM7 1L0 12.6667H14L7 1ZM7.63636 9.59649H6.36364V10.8246H7.63636V9.59649ZM7.63636 5.91228H6.36364V8.36842H7.63636V5.91228Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
