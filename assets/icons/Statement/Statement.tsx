import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function Statement({ size = 16, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      fill={getColor(color) || color}
      viewBox="0 0 16 18"
    >
      <Path
        width={size}
        height={size}
        fill={getColor(color) || color}
       d="M4.14279 12.6H11.8571V14.4H4.14279V12.6ZM4.14279 9H11.8571V10.8H4.14279V9ZM9.9285 0H2.21422C1.1535 0 0.285645 0.81 0.285645 1.8V16.2C0.285645 17.19 1.14386 18 2.20457 18H13.7856C14.8464 18 15.7142 17.19 15.7142 16.2V5.4L9.9285 0ZM13.7856 16.2H2.21422V1.8H8.96422V6.3H13.7856V16.2Z"
      />
    </Svg>
  );
}
