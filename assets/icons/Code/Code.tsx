import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Code({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        d="M2.70968 9.41935H1.35484V5.35484H0V4H2.70968V9.41935ZM8.58064 8.06452H5.87097V7.16129H7.67742C8.17419 7.16129 8.58064 6.75484 8.58064 6.25806V4.90323C8.58064 4.40645 8.17419 4 7.67742 4H4.51613V5.35484H7.22581V6.25806H5.41935C4.92258 6.25806 4.51613 6.66452 4.51613 7.16129V9.41935H8.58064V8.06452ZM14 8.51613V4.90323C14 4.40645 13.5935 4 13.0968 4H9.93548V5.35484H12.6452V6.25806H10.8387V7.16129H12.6452V8.06452H9.93548V9.41935H13.0968C13.5935 9.41935 14 9.0129 14 8.51613Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
