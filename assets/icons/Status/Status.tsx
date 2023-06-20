import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Status({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M11.1999 7H8.3999V8.05H11.1999V7Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
      <Path
        d="M11.1999 9.09961H8.3999V10.1496H11.1999V9.09961Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
      <Path
        d="M12.6 3.5H9.1V1.4C9.1 0.63 8.47 0 7.7 0H6.3C5.53 0 4.9 0.63 4.9 1.4V3.5H1.4C0.63 3.5 0 4.13 0 4.9V12.6C0 13.37 0.63 14 1.4 14H12.6C13.37 14 14 13.37 14 12.6V4.9C14 4.13 13.37 3.5 12.6 3.5ZM6.3 3.5V1.4H7.7V3.5V4.9H6.3V3.5ZM12.6 12.6H1.4V4.9H4.9C4.9 5.67 5.53 6.3 6.3 6.3H7.7C8.47 6.3 9.1 5.67 9.1 4.9H12.6V12.6Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
      <Path
        d="M4.9001 9.1C5.48 9.1 5.9501 8.6299 5.9501 8.05C5.9501 7.4701 5.48 7 4.9001 7C4.3202 7 3.8501 7.4701 3.8501 8.05C3.8501 8.6299 4.3202 9.1 4.9001 9.1Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
      <Path
        d="M6.35605 9.926C5.90805 9.73 5.41805 9.625 4.90005 9.625C4.38205 9.625 3.89205 9.73 3.44405 9.926C3.05205 10.094 2.80005 10.472 2.80005 10.899V11.2H7.00005V10.899C7.00005 10.472 6.74805 10.094 6.35605 9.926Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
