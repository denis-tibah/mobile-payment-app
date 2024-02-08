import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export function Zazoo({ size = 14, color }: any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <G clip-path="url(#clip0_4871_4491)">
        <Path
          d="M13.99 2.95C13.99 3.47 13.86 3.98 13.61 4.43C13.61 4.44 13.6 4.45 13.59 4.46C13.46 4.7 13.29 4.92 13.08 5.11L12.94 5.25C12.46 5.66 11.86 5.9 11.19 5.9H2.79C1.25 5.9 0 4.58 0 2.95C0 2.14 0.31 1.4 0.82 0.87C1.33 0.34 2.02 0 2.79 0H11.2C11.25 0 11.29 0 11.35 0C11.37 0 11.39 0 11.41 0C12.09 0.05 12.76 0.37 13.26 0.94C13.76 1.51 14 2.22 14 2.94L13.99 2.95Z"
          fill="#086AFB"
        />
        <Path
          d="M14 11.0501C14 11.8601 13.69 12.6001 13.18 13.1301C12.67 13.6701 11.97 14.0001 11.2 14.0001H2.79002C2.64002 14.0001 2.51002 13.9901 2.37002 13.9601C2.36002 13.9601 2.34002 13.9601 2.33002 13.9601C1.75002 13.8501 1.19002 13.5501 0.76002 13.0501C0.27002 12.4801 0.0200195 11.7701 0.0200195 11.0501C0.0200195 10.2601 0.33002 9.4601 0.92002 8.8801L1.18002 8.6301C1.63002 8.2901 2.18002 8.1001 2.78002 8.1001H11.19C12.74 8.1001 13.99 9.4201 13.99 11.0501H14Z"
          fill="#E53CA9"
        />
        <Path
          d="M13.9898 2.95C13.9898 3.47 13.8598 3.98 13.6098 4.43C13.6098 4.44 13.5998 4.45 13.5898 4.46C13.4598 4.7 13.2898 4.92 13.0798 5.11L12.9398 5.25L9.99977 8.09L4.70977 13.22C4.21977 13.7 3.60977 13.95 2.99977 13.99C2.78977 14.01 2.57977 13.99 2.35977 13.95C2.34977 13.95 2.32977 13.95 2.31977 13.95C1.73977 13.84 1.17977 13.54 0.749766 13.04C0.259766 12.48 0.00976562 11.77 0.00976562 11.05C0.00976562 10.26 0.319766 9.46 0.909766 8.88L1.16977 8.63L3.97977 5.9H3.99977L9.28977 0.78C9.80976 0.28 10.4598 0.02 11.1098 0C11.1898 0 11.2698 0 11.3398 0C11.3598 0 11.3798 0 11.3998 0C12.0798 0.05 12.7498 0.37 13.2498 0.94C13.7498 1.5 13.9898 2.22 13.9898 2.93V2.95Z"
          fill="#3D33D1"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4871_4491">
          <Rect width={size} height={size} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}