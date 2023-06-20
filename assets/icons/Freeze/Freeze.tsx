import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Freeze({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M14 7.62V6.38H11L13.16 4.22L12.28 3.35L9.28 6.35H7.68V4.75L10.68 1.75L9.81 0.869999L7.62 3V0H6.38V3L4.22 0.84L3.35 1.72L6.35 4.72V6.32H4.75L1.75 3.32L0.869999 4.19L3 6.38H0V7.62H3L0.84 9.78L1.72 10.65L4.72 7.65H6.32V9.25L3.32 12.25L4.19 13.13L6.38 11V14H7.62V11L9.78 13.16L10.65 12.28L7.65 9.28V7.68H9.25L12.25 10.68L13.13 9.81L11 7.62H14Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
