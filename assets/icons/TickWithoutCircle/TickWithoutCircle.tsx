import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function TickWithoutCircle({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 12"
      fill={getColor(color) || color}
    >
      <Path
        d="M4.87371 11.5184C5.1601 11.8338 5.58145 12 6.0028 12C6.42415 12 6.8455 11.8169 7.13189 11.5184L15.5925 2.5451C16.1652 1.93039 16.1317 0.966464 15.5082 0.401813C14.8847 -0.162905 13.9071 -0.129804 13.3344 0.484898L6.00351 8.2619L2.66624 4.72228C2.09347 4.10757 1.1158 4.07447 0.492398 4.63919C-0.131725 5.20391 -0.165298 6.16784 0.407469 6.78247L4.87371 11.5184Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
