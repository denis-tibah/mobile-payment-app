import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";

export function Change({ style, size = 14, color }) {
  return (
    <Svg
      width={size}
      style={style}
      height={size}
      viewBox={`0 0 14 14`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14 2.226L6.013 10.22L3.045 7.252L4.032 6.265L6.013 8.246L13.013 1.246L14 2.226ZM12.453 5.754C12.544 6.153 12.6 6.573 12.6 7C12.6 10.094 10.094 12.6 7 12.6C3.906 12.6 1.4 10.094 1.4 7C1.4 3.906 3.906 1.4 7 1.4C8.106 1.4 9.128 1.722 9.996 2.275L11.004 1.267C9.87 0.469 8.491 0 7 0C3.136 0 0 3.136 0 7C0 10.864 3.136 14 7 14C10.864 14 14 10.864 14 7C14 6.167 13.846 5.369 13.58 4.627L12.453 5.754Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
}
