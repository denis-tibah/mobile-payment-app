import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { getColor } from "../color";

export function Globe({ size = 14, color }: any) {
    return <Svg width={size} height={size} viewBox="0 0 14 14" fill={getColor(color) || color}>
        <G clip-path="url(#clip0_2908_716)">
            <Path d="M7 0C3.136 0 0 3.136 0 7C0 10.864 3.136 14 7 14C10.864 14 14 10.864 14 7C14 3.136 10.864 0 7 0ZM1.4 7C1.4 6.573 1.456 6.153 1.547 5.754L4.893 9.1V9.8C4.893 10.57 5.523 11.2 6.293 11.2V12.551C3.542 12.201 1.4 9.849 1.4 7ZM11.123 10.78C10.941 10.213 10.423 9.8 9.793 9.8H9.093V7.7C9.093 7.315 8.778 7 8.393 7H4.193V5.6H5.593C5.978 5.6 6.293 5.285 6.293 4.9V3.5H7.693C8.463 3.5 9.093 2.87 9.093 2.1V1.813C11.144 2.639 12.6 4.655 12.6 7C12.6 8.456 12.033 9.786 11.123 10.78Z" fill="#086AFB" />
        </G>
        <Defs>
            <ClipPath id="clip0_2908_716">
                <Rect width={size} height={size} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
}