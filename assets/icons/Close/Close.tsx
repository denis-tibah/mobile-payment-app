import { Path, Svg } from "react-native-svg";
import { getColor } from "../color";
export function Close({ style, size = 14, color }: any) {
  return (
    <Svg
      style={style}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill={getColor(color) || color}
    >
      <Path
        d="M0.888889 8L0 7.11111L3.11111 4L0 0.888889L0.888889 0L4 3.11111L7.11111 0L8 0.888889L4.88889 4L8 7.11111L7.11111 8L4 4.88889L0.888889 8Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
