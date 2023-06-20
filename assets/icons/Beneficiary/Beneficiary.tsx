import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function Beneficiary({ size = 14, color }:any) {
  return (
    <Svg
      width={size}
      height={size}
      fill={getColor(color) || color}
      viewBox="0 0 14 15"
    >
      <Path
        width={size}
        height={size}
        fill={getColor(color) || color}
        d="M11.287 7.92c1.37.76 2.45 2.1 2.713 3.705a2.615 2.615 0 0 1-2.625 2.625H10.18a3.436 3.436 0 0 0 1.08-1.75h.118a.86.86 0 0 0 .875-.875c-.233-.875-.818-1.605-1.605-2.07a6.614 6.614 0 0 0-1.633-1.867l.263-.526A1.733 1.733 0 0 0 10.473 5.5V3.75c0-.788-.495-1.43-1.195-1.663A4.41 4.41 0 0 0 7.935.337a3.51 3.51 0 0 1 4.287 3.413V5.5c.028.932-.352 1.78-.934 2.42zm-3.412 6.33h-5.25A2.615 2.615 0 0 1 0 11.625C.263 10.02 1.343 8.68 2.712 7.92A3.47 3.47 0 0 1 1.75 5.5V3.75a3.51 3.51 0 0 1 3.5-3.5 3.51 3.51 0 0 1 3.5 3.5V5.5c0 .932-.38 1.78-.963 2.42 1.37.757 2.45 2.1 2.713 3.705a2.615 2.615 0 0 1-2.625 2.625zM7 5.5V3.75C7 2.788 6.213 2 5.25 2S3.5 2.788 3.5 3.75V5.5c0 .963.787 1.75 1.75 1.75S7 6.463 7 5.5zm1.75 6.125C8.37 10.107 6.882 9 5.25 9s-3.12 1.107-3.5 2.625c0 .495.38.875.875.875h5.25a.86.86 0 0 0 .875-.875z"
      />
    </Svg>
  );
}
