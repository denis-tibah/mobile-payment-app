import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";

export const PinGPS = ({ size = 24, color = "blue" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
  >
    <G clip-path="url(#clip0_35_1360)">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.9 0C4.191 0 2 2.191 2 4.9C2 8.575 6.9 14 6.9 14C6.9 14 11.8 8.575 11.8 4.9C11.8 2.191 9.609 0 6.9 0ZM3.4 4.9C3.4 2.968 4.968 1.4 6.9 1.4C8.832 1.4 10.4 2.968 10.4 4.9C10.4 6.916 8.384 9.933 6.9 11.816C5.444 9.947 3.4 6.895 3.4 4.9Z"
        fill={getColor(color) || color}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.8999 6.6499C7.8664 6.6499 8.6499 5.8664 8.6499 4.8999C8.6499 3.9334 7.8664 3.1499 6.8999 3.1499C5.9334 3.1499 5.1499 3.9334 5.1499 4.8999C5.1499 5.8664 5.9334 6.6499 6.8999 6.6499Z"
        fill={getColor(color) || color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_35_1360">
        <Rect
          width={size}
          height={size}
          fill={getColor(color) || color}
          transform="translate(1)"
        />
      </ClipPath>
      </Defs>
    </Svg>
  );
};
