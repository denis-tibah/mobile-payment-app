import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Map({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M13.6111 0L13.4867 0.0233333L9.33333 1.63333L4.66667 0L0.28 1.47778C0.116667 1.53222 0 1.67222 0 1.85111V13.6111C0 13.8289 0.171111 14 0.388889 14L0.513333 13.9767L4.66667 12.3667L9.33333 14L13.72 12.5222C13.8833 12.4678 14 12.3278 14 12.1489V0.388889C14 0.171111 13.8289 0 13.6111 0ZM5.44444 1.92111L8.55556 3.01V12.0789L5.44444 10.99V1.92111ZM1.55556 2.69111L3.88889 1.90556V11.0056L1.55556 11.9078V2.69111ZM12.4444 11.3089L10.1111 12.0944V3.00222L12.4444 2.1V11.3089Z"
        fill={getColor(color) || color}
        fillOpacity="1"
      />
    </Svg>
  );
}
