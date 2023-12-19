import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export function PinNumberCode({ size = 24, color = "pink" }) {
    return (
        <Svg
        width={size}
        height={size}
        viewBox="0 0 18 16"
        fill={getColor(color) || color}
        >
            <G clip-path="url(#clip0_35_1360)">
                <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.8 0.800049H16.2C17.19 0.800049 18 1.61005 18 2.60005V13.4C18 14.39 17.19 15.2 16.2 15.2H1.8C0.81 15.2 0 14.39 0 13.4V2.60005C0 1.61005 0.81 0.800049 1.8 0.800049ZM1.8 13.4H16.2V2.60005H1.8V13.4ZM4.04107 10.7V6.65005L3.23107 7.24405L2.70907 6.44305L4.29307 5.30005H5.07607V10.7H4.04107ZM8.52299 6.24504C8.97299 6.24504 9.25199 6.53304 9.25199 6.89304C9.25199 7.22604 9.12599 7.46904 8.76599 7.84704C8.44202 8.18901 7.81209 8.81894 6.84922 9.78181L6.84899 9.78204V10.7H10.35V9.80904H8.21699L8.18999 9.76404C8.57094 9.38309 8.87866 9.07885 9.11098 8.84917C9.25188 8.70987 9.36505 8.59798 9.44999 8.51304C9.99899 7.97304 10.278 7.41504 10.278 6.83904
                C10.278 6.62304 10.233 5.90304 9.45899 5.50704C9.03599 5.30004 8.32499 5.18304 7.70399 5.48004C7.01763 5.80648 6.83727 6.40538 6.80815 6.50208C6.80595 6.50935 6.80462 6.51378 6.80399 6.51504L7.71299 6.89304C7.80299 6.59604 8.05499 6.24504 8.52299 6.24504ZM12.5785 8.99164C12.6173 9.13398 12.7843 9.74605 13.491 9.74605C13.86 9.74605 14.292 9.49405 14.292 9.05305C14.292 8.55805 13.86 8.34205 13.356 8.34205H12.906V7.44205H13.32C13.617 7.44205 14.112 7.31605 14.112 6.79405C14.112 6.44305 13.833 6.20905 13.437 6.20905C12.987 6.20905 12.771 6.49705 12.672 6.78505L11.781 6.41605C11.88 6.11005 12.312 5.30005 13.446 5.30005C14.4142 5.30005 14.8213 5.86117 14.901 5.97095L14.904 5.97505C15.201 6.42505 15.156 7.01905 14.922 7.38805C14.787 7.58605 14.634 7.73005 14.454 7.82005V7.88305C14.706 7.98205 14.913 8.13505
                15.066 8.35105C15.399 8.81905 15.363 9.49405 15.075 9.93505C15.003 10.052 14.571 10.7 13.491 10.7C13.4901 10.7 13.4884 10.7001 13.4859 10.7002C13.3866 10.7027 12.041 10.7369 11.646 9.34105L12.573 8.97205C12.5744 8.97691 12.5762 8.98351 12.5785 8.99164Z"
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