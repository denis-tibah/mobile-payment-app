import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function Transaction({ size = 14, color }:any) {
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
        d="M11.62 12.526h1.68v1.407H9.1v-4.22h1.4v1.92a5.615 5.615 0 0 0 2.1-4.383c0-2.863-2.142-5.234-4.9-5.579V.25c3.535.352 6.3 3.349 6.3 7a7.026 7.026 0 0 1-2.38 5.276zM1.4 7.25c0-1.773.819-3.356 2.1-4.383v1.92h1.4V.568H.7v1.407h1.68A7.026 7.026 0 0 0 0 7.25c0 3.651 2.765 6.648 6.3 7v-1.421c-2.758-.345-4.9-2.716-4.9-5.579zm8.568-2.737L6.006 8.495l-1.981-1.99-.987.991 2.968 2.983 4.949-4.974-.987-.992z"
      />
    </Svg>
  );
}
