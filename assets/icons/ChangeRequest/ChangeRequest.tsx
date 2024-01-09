import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function ChangeRequest({ size = 14, color }: any) {
  return (
    <Svg width={size} height={size} fill={getColor(color)} viewBox="0 0 17 16">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        width={size}
        height={size}
        fill={getColor(color)}
        d="M16.5 7.98857V14.2057C16.5 15.1886 15.7 15.9886 14.7057 15.9886H2.28286C1.3 15.9886 0.5 15.1886 0.5 14.2057V1.78286C0.5 0.8 1.3 0 2.28286 0H9.36857V7.24571L10.7971 5.82857L12.0429 7.08571L8.47714 10.6514L4.93429 7.08571L6.18 5.82857L7.58571 7.24571V1.78286H2.28286V14.2171H14.7057V8H16.5V7.98857Z"
      />
    </Svg>
  );
}
