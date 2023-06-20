import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function Card({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      fill={getColor(color)}
      viewBox="0 0 14 15"
    >
      <Path
        width={size}
        height={size}
        fill={getColor(color)}
        d="M12.6 1.25H1.4c-.777 0-1.393.667-1.393 1.5l-.007 9c0 .832.623 1.5 1.4 1.5h11.2c.777 0 1.4-.668 1.4-1.5v-9c0-.833-.623-1.5-1.4-1.5zm0 10.5H1.4v-4.5h11.2v4.5zm0-7.5H1.4v-1.5h11.2v1.5z"
      />
    </Svg>
  );
}
