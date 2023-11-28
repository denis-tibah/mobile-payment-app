import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";

export function FaceId({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={getColor(color) || color}
    >
      <Path
        d="M7 3H5C3.89543 3 3 3.89543 3 5V7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M17 3H19C20.1046 3 21 3.89543 21 5V7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M16 8L16 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M8 8L8 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M9 16C9 16 10 17 12 17C14 17 15 16 15 16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M12 8L12 13L11 13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M7 21H5C3.89543 21 3 20.1046 3 19V17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
      <Path
        d="M17 21H19C20.1046 21 21 20.1046 21 19V17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={getColor(color) || color}
      />
    </Svg>
  );
}
