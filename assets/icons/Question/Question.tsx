import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export function Question({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 15"
      fill={getColor(color) || color}
    >
      <G clip-path="url(#clip0_56_692)">
        <Path
          d="M7.72 10.68C7.72 10.97 7.54 11.24 7.27 11.35C7 11.46 6.69 11.4 6.48 11.19C6.27 10.98 6.21 10.67 6.32 10.4C6.43 10.13 6.7 9.95 6.99 9.95C7.18 9.95 7.37 10.03 7.5 10.16C7.64 10.3 7.71 10.48 7.71 10.67L7.72 10.68ZM5.11 5.45C5.28 5.53 5.48 5.54 5.66 5.48C5.84 5.42 5.99 5.29 6.07 5.11C6.24 4.76 6.59 4.53 6.99 4.52C7.54 4.52 8 4.96 8.03 5.52C8.04 5.97 7.76 6.38 7.33 6.52C6.71 6.72 6.29 7.3 6.28 7.95V8.52C6.28 8.92 6.6 9.24 7 9.24C7.4 9.24 7.72 8.92 7.72 8.52V7.95L7.79 7.88C8.29 7.71 8.72 7.39 9.02 6.96C9.32 6.53 9.47 6.01 9.46 5.48C9.44 4.84 9.17 4.23 8.71 3.79C8.25 3.34 7.64 3.09 7 3.08H6.99C6.53 3.08 6.08 3.22 5.69 3.46C5.3 3.71 4.99 4.06 4.79 4.47C4.71 4.64 4.7 4.84 4.76 5.02C4.82 5.2 4.96 5.35 5.13 5.43H5.12L5.11 5.45ZM0 10.87V3.63C0 2.73 0.36 1.87 0.99 1.24C1.63 0.61 2.49 0.25 3.38 0.25H10.62C11.52 0.25 12.38 0.61 13.01 1.24C13.64 1.87 14 2.73 14 3.63V10.87C14 11.77 13.64 12.63 13.01 13.26C12.38 13.89 11.52 14.25 10.62 14.25H3.38C2.48 14.25 1.62 13.89 0.99 13.26C0.36 12.63 0 11.77 0 10.87ZM1.37 10.87C1.37 11.98 2.27 12.88 3.38 12.88H10.62C11.73 12.88 12.63 11.98 12.63 10.87V3.63C12.63 2.52 11.73 1.62 10.62 1.62H3.38C2.27 1.62 1.37 2.52 1.37 3.63V10.87Z"
          fill="#E7038E"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_56_692">
          <Rect
            width={size}
            height={size}
            fill={getColor(color) || color}
            transform="translate(0 0.25)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
