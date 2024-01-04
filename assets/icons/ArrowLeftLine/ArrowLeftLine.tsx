import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";

export const ArrowLeftLine = ({ size = 24, color = "pink" }) => {
    return (
        <Svg
        width={size}
        height={size}
        viewBox="0 0 14 10"
        fill={getColor(color) || color}
        >
        <G clip-path="url(#clip0_35_1360)">
            <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.85039 9.66404L0 4.83202L4.85039 0L6.08136 1.23097L3.34383 3.9685H14V5.69554H3.34383L6.08136 8.43307L4.85039 9.66404Z"
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
