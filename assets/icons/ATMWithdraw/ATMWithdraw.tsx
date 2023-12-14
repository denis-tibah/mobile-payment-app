import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export const ATMWithdraw = ({ size = 24, color = "pink" }) => {
    return (
        <Svg
        width={size}
        height={size}
        viewBox="0 0 18 18"
        fill={getColor(color) || color}
        >
        <G clip-path="url(#clip0_35_1360)">
            <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.52571 16.1742C3.80571 16.1742 3.09857 15.8914 2.59714 15.3771C2.09571 14.8756 1.8 14.1814 1.8 13.4742V3.12422H0V1.28564H17.46V3.12422H15.66V13.4871C15.66 14.1942 15.3643 14.8885 14.8629 15.3899C14.3486 15.8914 13.6543 16.1871 12.9343 16.1871H4.52571V16.1742ZM8.46 14.3356H12.9343C13.41 14.3356 13.8086 13.9499 13.8086 13.4742V3.12422H8.47286V14.3485L8.46 14.3356ZM3.66429 13.4742C3.66429 13.7056 3.75429 13.9242 3.92143 14.0914C4.07571 14.2456 4.30714 14.3485 4.53857 14.3485H6.60857V3.12422H3.66429V13.4871V13.4742Z"
            fill={getColor(color) || color}
            />
        </G>
        <Defs>
            <ClipPath id="clip0_35_1360">
            <Rect
                width={size}
                height={size}
                fill={getColor(color) || color}
                transform="translate(1)"
            />
            </ClipPath>
        </Defs>
        </Svg>
    );
}
