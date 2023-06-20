import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function Facebook({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 6 10"
      fill={getColor(color) || color}
    >
      <Path
        d="M2.31545 10H4.09575V5.52734H5.47833L5.7056 3.75H4.09575V2.51953C4.09575 2.24609 4.13363 2.03125 4.24727 1.89453C4.3609 1.73828 4.60712 1.66016 4.94803 1.66016H5.85712V0.078125C5.51621 0.0390625 5.06166 0 4.53136 0C3.84954 0 3.31924 0.214844 2.92151 0.625C2.50484 1.03516 2.31545 1.60156 2.31545 2.34375V3.75H0.857117V5.52734H2.31545V10Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
}
