import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function BusinessBag({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 13"
      fill={getColor(color) || color}
    >
      <Path
        d="M12.6 2.8H9.8V1.4L8.4 0H5.6L4.2 1.4V2.8H1.4C0.63 2.8 0 3.43 0 4.2V7.7C0 8.225 0.28 8.666 0.7 8.911V11.2C0.7 11.977 1.323 12.6 2.1 12.6H11.9C12.677 12.6 13.3 11.977 13.3 11.2V8.904C13.713 8.659 14 8.211 14 7.7V4.2C14 3.43 13.37 2.8 12.6 2.8ZM5.6 1.4H8.4V2.8H5.6V1.4ZM1.4 4.2H12.6V7.7H9.1V5.6H4.9V7.7H1.4V4.2ZM7.7 8.4H6.3V7H7.7V8.4ZM11.9 11.2H2.1V9.1H4.9V9.8H9.1V9.1H11.9V11.2Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
