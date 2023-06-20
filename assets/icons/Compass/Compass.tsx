import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Compass({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M7 0C3.136 0 0 3.136 0 7C0 10.864 3.136 14 7 14C10.864 14 14 10.864 14 7C14 3.136 10.864 0 7 0ZM7 12.6C3.913 12.6 1.4 10.087 1.4 7C1.4 3.913 3.913 1.4 7 1.4C10.087 1.4 12.6 3.913 12.6 7C12.6 10.087 10.087 12.6 7 12.6ZM3.15 10.85L8.407 8.407L10.85 3.15L5.593 5.593L3.15 10.85ZM7 6.23C7.427 6.23 7.77 6.573 7.77 7C7.77 7.427 7.427 7.77 7 7.77C6.573 7.77 6.23 7.427 6.23 7C6.23 6.573 6.573 6.23 7 6.23Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
