import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function StatementsIcon({ size = 18, color = "blue" }) {
  return (
    <Svg
     width="22"
     height="22"
     viewBox="0 0 22 22"
      fill={getColor(color) || color}
    >
 <Path
        d="M6.28582 15.4H15.7144V17.6H6.28582V15.4ZM6.28582 11H15.7144V13.2H6.28582V11ZM13.3572 0H3.92868C2.63225 0 1.57153 0.99 1.57153 2.2V19.8C1.57153 21.01 2.62046 22 3.91689 22H18.0715C19.368 22 20.4287 21.01 20.4287 19.8V6.6L13.3572 0ZM18.0715 19.8H3.92868V2.2H12.1787V7.7H18.0715V19.8Z"
        fill={getColor(color) || color}
      />
    </Svg>

  );
}
