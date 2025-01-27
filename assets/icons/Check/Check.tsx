import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";
export function Check({ size = 14, color }: any) {
  return (
    <Svg width={size} height={size} fill={getColor(color)} viewBox="0 0 24 24">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        width={size}
        height={size}
        fill={getColor(color)}
        d="M0 12C0 5.376 5.376 0 12 0C18.624 0 24 5.376 24 12C24 18.624 18.624 24 12 24C5.376 24 0 18.624 0 12ZM2.4 12C2.4 17.292 6.708 21.6 12 21.6C17.292 21.6 21.6 17.292 21.6 12C21.6 6.708 17.292 2.4 12 2.4C6.708 2.4 2.4 6.708 2.4 12ZM10.2881 17.1429C9.92696 17.1429 9.5658 17.0004 9.32033 16.73L5.49212 12.6707C5.00117 12.1439 5.02995 11.3176 5.56491 10.8336C6.09925 10.3495 6.93726 10.3779 7.4282 10.9048L10.2887 13.9388L16.5723 7.27277C17.0632 6.74588 17.9012 6.71751 18.4356 7.20155C18.97 7.68554 18.9988 8.51177 18.5078 9.03865L11.2559 16.73C11.0104 16.986 10.6493 17.1429 10.2881 17.1429Z"
      />
    </Svg>
  );
}
