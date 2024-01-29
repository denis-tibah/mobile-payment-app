import { Svg, Path, G, Defs, ClipPath, Rect } from "react-native-svg";

import { getColor } from "../color";

export function TransactionsLeftRight({ size = 14, color }: any) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="#E7038E"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G id="01-ICONS/14/transactions" clipPath="url(#clip0_4204_59844)">
        <Path
          id="Union"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 1.8C12.9729 1.8 16.2 5.02714 16.2 9C16.2 12.9729 12.9729 16.2 9 16.2C5.02714 16.2 1.8 12.9729 1.8 9C1.8 5.02714 5.02714 1.8 9 1.8ZM9 0C4.02429 0 0 4.02429 0 9C0 13.9757 4.02429 18 9 18C13.9757 18 18 13.9757 18 9C18 4.02429 13.9757 0 9 0ZM9.43715 8.62714L9.44358 8.62071L10.53 9.70714L13.1914 7.04571C13.4871 6.73714 13.4871 6.24857 13.1914 5.95285L10.53 3.29143L9.43715 4.38428L10.7871 5.73428H6.13286V7.27714H10.7871L9.44358 8.62071L9.43715 8.61428V8.62714ZM8.55643 9.37928L8.56286 9.37285V9.38571L8.55643 9.37928ZM7.21286 10.7229L8.55643 9.37928L7.47001 8.29285L4.80858 10.9543C4.51286 11.2629 4.51286 11.7514 4.80858 12.0471L7.47001 14.7086L8.56286 13.6157L7.21286 12.2657H11.8671V10.7229H7.21286Z"
          fill={getColor(color) || color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4204_59844">
          <Rect width={size} height={size} fill={getColor(color) || color} />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
