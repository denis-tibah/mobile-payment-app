import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Account({ size = 24, color = "pink" }:any) {
  return (
    <Svg
      width={size}
      height={size}
      fill={getColor(color) || color}
      preserveAspectRatio="none"
      viewBox="0 0 14 15"
    >
      <Path
        width={size}
        height={size}
        fill={getColor(color) || color}
        d="M12.444.25H1.556C.7.25 0 .95 0 1.806v10.888c0 .856.7 1.556 1.556 1.556h10.888c.856 0 1.556-.7 1.556-1.556V1.806C14 .95 13.3.25 12.444.25zM1.556 12.694V1.806h4.666v10.888H1.556zm10.888 0H7.778V7.25h4.666v5.444zm0-7H7.778V1.806h4.666v3.888z"
      />
    </Svg>
  );
}
