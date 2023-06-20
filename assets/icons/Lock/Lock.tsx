import { getColor } from "../color";
import Svg,{Path} from "react-native-svg";
export function Lock({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M9.33333 4.66667H8.66666V3.33333C8.66666 1.49333 7.17333 0 5.33333 0C3.49333 0 2 1.49333 2 3.33333V4.66667H1.33333C0.6 4.66667 0 5.26667 0 6V12.6667C0 13.4 0.6 14 1.33333 14H9.33333C10.0667 14 10.6667 13.4 10.6667 12.6667V6C10.6667 5.26667 10.0667 4.66667 9.33333 4.66667ZM3.33333 3.33333C3.33333 2.22667 4.22667 1.33333 5.33333 1.33333C6.44 1.33333 7.33333 2.22667 7.33333 3.33333V4.66667H3.33333V3.33333ZM9.33333 12.6667H1.33333V6H9.33333V12.6667ZM5.33333 10.6667C6.06667 10.6667 6.66667 10.0667 6.66667 9.33333C6.66667 8.6 6.06667 8 5.33333 8C4.6 8 4 8.6 4 9.33333C4 10.0667 4.6 10.6667 5.33333 10.6667Z"
        fill={getColor(color) || color}
        fillOpacity="1"
      />
    </Svg>
  );
}
