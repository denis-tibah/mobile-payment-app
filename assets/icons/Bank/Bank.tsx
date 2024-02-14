import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export const Bank = ({ size = 24, color = "pink" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={getColor(color) || color}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3.5L7 0L14 3.5V5.12H0V3.5ZM1.28003 5.79001V11.75H2.86003V5.79001H1.28003ZM6.16003 5.79001V11.75H7.74003V5.79001H6.16003ZM11.04 5.79001V11.75H12.62V5.79001H11.04ZM0 12.42V14H14V12.42H0Z"
        fill={getColor(color) || color}
      />
    </Svg>
  );
};
