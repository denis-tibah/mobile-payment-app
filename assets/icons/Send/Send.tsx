import { getColor } from "../color";
import Svg,{Path} from "react-native-svg";
export function Send({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill={getColor(color) || color}
    >
      <Path
        d="M1.72286 3.88328L8.16 6.64328L1.71429 5.78613L1.72286 3.88328ZM8.15143 11.3576L1.71429 14.1176V12.2147L8.15143 11.3576ZM0.00857142 1.28613L0 7.28613L12.8571 9.00042L0 10.7147L0.00857142 16.7147L18 9.00042L0.00857142 1.28613Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
