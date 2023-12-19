import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";

export const ChipPinTransaction = ({size = 18, color = getColor("blue")}) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.3457 0H4.65429C3.36857 0 2.21143 0.527143 1.36286 1.36286C1.15714 1.56857 0.964286 1.8 0.797143 2.04429C0.552857 2.41714 0.347143 2.82857 0.205714 3.26571C0.0771428 3.70286 0 4.17857 0 4.65429V13.3457C0 13.8214 0.0771428 14.2971 0.205714 14.7343C0.347143 15.1714 0.552857 15.5829 0.797143 15.9557C0.964286 16.2 1.15714 16.4314 1.36286 16.6371C2.21143 17.4729 3.36857 18 4.65429 18H13.3457C15.9171 18 18 15.9171 18 13.3457V4.65429C18 2.08286 15.9171 0 13.3457 0ZM7.14857 1.86429H10.8643V5.27143H7.14857V1.86429ZM1.86429 4.65429C1.86429 3.11143 3.11143 1.86429 4.65429 1.86429H5.28429V5.27143H1.86429V4.65429ZM5.28429 16.1357H4.65429C3.11143 16.1357 1.86429 14.8886 1.86429 13.3457V12.7157H5.28429V16.1357ZM10.8643 16.1357H7.14857V12.7157H10.8643V16.1357ZM16.1486 13.3457C16.1486 14.8886 14.8886 16.1357 13.3457 16.1357H12.7286V12.7157H16.1486V13.3457ZM16.1486 10.8643H1.86429V7.13571H16.1486V10.8643ZM16.1486 5.27143H12.7286V1.86429H13.3457C14.8886 1.86429 16.1486 3.11143 16.1486 4.65429V5.27143Z"
            fill={color}
        />
        </Svg>
    );
}