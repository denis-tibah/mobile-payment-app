import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Email({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill={getColor(color) || color}
    >
      <Path
        d="M18 3.21428C18 2.15356 17.19 1.28571 16.2 1.28571H1.8C0.81 1.28571 0 2.15356 0 3.21428V14.7857C0 15.8464 0.81 16.7143 1.8 16.7143H16.2C17.19 16.7143 18 15.8464 18 14.7857V3.21428ZM16.2 3.21428L9 8.03571L1.8 3.21428H16.2ZM16.2 14.7857H1.8V5.14285L9 9.96428L16.2 5.14285V14.7857Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
