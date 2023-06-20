import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function CalenderEmpty({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M11.8125 1.27273H11.1562V0H9.84375V1.27273H3.28125V0H1.96875V1.27273H1.3125C0.590625 1.27273 0 1.84545 0 2.54545V12.7273C0 13.4273 0.590625 14 1.3125 14H11.8125C12.5344 14 13.125 13.4273 13.125 12.7273V2.54545C13.125 1.84545 12.5344 1.27273 11.8125 1.27273ZM11.8125 12.7273H1.3125V5.72727H11.8125V12.7273ZM11.8125 4.45455H1.3125V2.54545H11.8125V4.45455Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
