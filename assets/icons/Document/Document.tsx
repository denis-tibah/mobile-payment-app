import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Document({ size = 24, color = "blue" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M4 9.8H10V11.2H4V9.8ZM4 7H10V8.4H4V7ZM8.5 0H2.5C1.675 0 1 0.63 1 1.4V12.6C1 13.37 1.6675 14 2.4925 14H11.5C12.325 14 13 13.37 13 12.6V4.2L8.5 0ZM11.5 12.6H2.5V1.4H7.75V4.9H11.5V12.6Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
