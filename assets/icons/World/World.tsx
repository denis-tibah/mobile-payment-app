import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function World({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={getColor(color) || color}
    >
      <Path
        d="M8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM2 8C2 7.5425 2.06 7.0925 2.1575 6.665L5.7425 10.25V11C5.7425 11.825 6.4175 12.5 7.2425 12.5V13.9475C4.295 13.5725 2 11.0525 2 8ZM12.4175 12.05C12.2225 11.4425 11.6675 11 10.9925 11H10.2425V8.75C10.2425 8.3375 9.905 8 9.4925 8H4.9925V6.5H6.4925C6.905 6.5 7.2425 6.1625 7.2425 5.75V4.25H8.7425C9.5675 4.25 10.2425 3.575 10.2425 2.75V2.4425C12.44 3.3275 14 5.4875 14 8C14 9.56 13.3925 10.985 12.4175 12.05Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
