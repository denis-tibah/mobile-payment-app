import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";

export const FinancialDataGraph = ({ size = 24, color = "pink" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill={getColor(color) || color}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.20865 16.7657C1.96723 17.55 3.00865 18 4.08865 18V17.9871H17.1001C17.6015 17.9871 18.0001 17.5757 18.0001 17.0614C18.0001 16.5471 17.6015 16.1357 17.1001 16.1357H4.08865C2.84151 16.1357 1.81294 15.0814 1.81294 13.7829V0.925714C1.81294 0.411429 1.41437 0 0.912939 0C0.411511 0 0.0129395 0.411429 0.0129395 0.925714V13.7829C0.0129395 14.9143 0.437225 15.9686 1.20865 16.7657ZM9.25715 2.66144H11.0572V13.2043H9.25715V2.66144ZM13.8858 6.56998H15.6858V13.2171H13.8858V6.56998ZM6.42861 6.56998H4.62861V13.2171H6.42861V6.56998Z"
        fill={getColor(color) || color}
        fill-opacity="1"
      />
    </Svg>
  );
};
