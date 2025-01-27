import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";

export const IconQr = ({ size = 24, color = "blue" }) => {
    return (
        <Svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        fill={getColor(color) || color}
        >
        <G clip-path="url(#clip0_4950_18751)">
            <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.85 5.92H1.08V5.93C0.8 5.93 0.53 5.81 0.32 5.61C0.11 5.41 0 5.14 0 4.85V1.08C0 0.48 0.48 0 1.08 0H4.85C5.13 0 5.4 0.12 5.61 0.32C5.82 0.52 5.93 0.79 5.93 1.08V4.84C5.93 5.12 5.81 5.39 5.61 5.6C5.41 5.81 5.14 5.92 4.85 5.92ZM4.31 1.62H1.62V4.31H4.31V1.62ZM4.85 14H1.08C0.8 14 0.53 13.88 0.32 13.68C0.11 13.48 0 13.21 0 12.92V9.15001C0 8.55001 0.48 8.07001 1.08 8.07001H4.85C5.13 8.07001 5.4 8.19001 5.61 8.39001C5.82 8.59001 5.93 8.86001 5.93 9.15001V12.92C5.93 13.2 5.81 13.47 5.61 13.68C5.41 13.89 5.14 14 4.85 14ZM4.31 9.69001H1.62V12.38H4.31V9.690 01ZM9.14995 5.92H12.9199C13.2099 5.92 13.4799 5.81 13.6799 5.6C13.8799 5.39 13.9999 5.12 13.9999 4.84V1.08C13.9999 0.79 13.8899 0.52 13.6799 0.32C13.4699 0.12 13.1999 0 12.9199 0H9.14995C8.54995 0 8.06995 0.48 8.06995 1.08V4.85C8.06995 5.14 8.17995 5.41 8.38995 5.61C8.59995 5.81 8.86995 5.93 9.14995 5.93V5.92ZM9.68995 1.61H12.3799V4.3H9.68995V1.62V1.61ZM11.85 10.23L10.24 10.23V8.61H9.02999L9.02 8.62C8.8 8.62 8.62 8.8 8.62 9.02V10.23L10.23 10.23L10.23 11.84H8.60999V13.05L8.61999 13.06C8.61999 13.28 8.79999 13.46 9.01999 13.46H10.23L10.23 11.85H11.85L11.85 10.24H13.47V9.02999L13.46 9.02C13.46 8.8 13.28 8.62 13.06 8.62H11.85L11.85 10.23ZM13.06 13.46C13.28 13.46 13.46 13.28 13.46 13.06V11.85H11.84V13.47H13.05L13 .06 13.06 13.46Z"
            fill={getColor(color) || color}
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4950_18751">
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
