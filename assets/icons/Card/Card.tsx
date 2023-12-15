import Svg, { Path } from "react-native-svg";
import { getColor } from "../color";

export const CardIcon = ({ size = 14, color = 'pink' } : any) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M16.2 1.28564H1.8C0.801 1.28564 0.00899999 2.14386 0.00899999 3.21422L0 14.7856C0 15.856 0.801 16.7142 1.8 16.7142H16.2C17.199 16.7142 18 15.856 18 14.7856V3.21422C18 2.14386 17.199 1.28564 16.2 1.28564ZM16.2 14.7856H1.8V8.99993H16.2V14.7856ZM16.2 5.14279H1.8V3.21422H16.2V5.14279Z"
        fill={getColor(color)}
      />
    </Svg>
  );
}
