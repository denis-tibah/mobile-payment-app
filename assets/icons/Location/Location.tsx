import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Location({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M6.9 0C4.191 0 2 2.191 2 4.9C2 8.575 6.9 14 6.9 14C6.9 14 11.8 8.575 11.8 4.9C11.8 2.191 9.609 0 6.9 0ZM3.4 4.9C3.4 2.968 4.968 1.4 6.9 1.4C8.832 1.4 10.4 2.968 10.4 4.9C10.4 6.916 8.384 9.933 6.9 11.816C5.444 9.947 3.4 6.895 3.4 4.9Z"
        fill={getColor(color) || color}
      />
      <Path
        d="M6.90002 6.6499C7.86652 6.6499 8.65002 5.8664 8.65002 4.8999C8.65002 3.9334 7.86652 3.1499 6.90002 3.1499C5.93353 3.1499 5.15002 3.9334 5.15002 4.8999C5.15002 5.8664 5.93353 6.6499 6.90002 6.6499Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
