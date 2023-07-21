import Svg, { Circle, G, Line, Path } from "react-native-svg";
import { getColor } from "../color";
export function Gbp({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="-6.4 -6.4 76.80 76.80"
      stroke={getColor(color) || color}
      strokeWidth="3.5200000000000005"
      fill="none"
    >
      <G id="SVGRepo_bgCarrier" strokeWidth="0" />

      <G
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <G id="SVGRepo_iconCarrier">
        <Circle cx="31.1" strokeWidth="4" cy="31.05" r="25.29" />

        <Path strokeWidth="4" d="M41.19,40.91a12.43,12.43,0,1,1-2.34-21.14" />

        <Line strokeWidth="4" x1="14.99" y1="28.04" x2="35.67" y2="28.04" />

        <Line strokeWidth="4" x1="14.99" y1="34.34" x2="33.17" y2="34.34" />
      </G>
    </Svg>
  );
}
