import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Increase({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M9.8 3L11.403 4.603L7.987 8.019L5.187 5.219L0 10.413L0.987 11.4L5.187 7.2L7.987 10L12.397 5.597L14 7.2V3H9.8Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
