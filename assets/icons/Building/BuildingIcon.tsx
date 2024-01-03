import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export const BuildingIcon = ({ size = 24, color = "blue" }) => {
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
          d="M10.8889 6.22222V0H3.11111V3.11111H0V14H6.22222V10.8889H7.77778V14H14V6.22222H10.8889ZM3.11111 12.4444H1.55556V10.8889H3.11111V12.4444ZM3.11111 9.33333H1.55556V7.77778H3.11111V9.33333ZM3.11111 6.22222H1.55556V4.66667H3.11111V6.22222ZM6.22222 9.33333H4.66667V7.77778H6.22222V9.33333ZM6.22222 6.22222H4.66667V4.66667H6.22222V6.22222ZM6.22222 3.11111H4.66667V1.55556H6.22222V3.11111ZM9.33333 9.33333H7.77778V7.77778H9.33333V9.33333ZM9.33333 6.22222H7.77778V4.66667H9.33333V6.22222ZM9.33333 3.11111H7.77778V1.55556H9.33333V3.11111ZM12.4444 12.4444H10.8889V10.8889H12.4444V12.4444ZM12.4444 9.33333H10.8889V7.77778H12.4444V9.33333Z"
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
}
