import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Salutation({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M12.6 3.5H9.1V1.4C9.1 0.63 8.47 0 7.7 0H6.3C5.53 0 4.9 0.63 4.9 1.4V3.5H1.4C0.63 3.5 0 4.13 0 4.9V12.6C0 13.37 0.63 14 1.4 14H12.6C13.37 14 14 13.37 14 12.6V4.9C14 4.13 13.37 3.5 12.6 3.5ZM6.3 3.5V1.4H7.7V3.5V4.9H6.3V3.5ZM12.6 12.6H1.4V4.9H4.9C4.9 5.67 5.53 6.3 6.3 6.3H7.7C8.47 6.3 9.1 5.67 9.1 4.9H12.6V12.6Z"
        fill={getColor(color) || color}
        fillOpacity="1"
      />
    </Svg>
  );
}
