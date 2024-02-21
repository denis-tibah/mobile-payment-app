
import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";

export function Payee({ size = 24, color = "blue" }) {
  return (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill={getColor(color) || color}
  >
    <Path
      d="M0.437235 16.4829C1.02866 17.4343 2.04438 18 3.15009 18H9.95152C11.0572 18 12.073 17.4343 12.6644 16.4829C13.1658 15.6857 13.2301 14.6057 12.8572 13.59C12.3044 12.1243 11.1729 10.8129 9.74581 10.0157L9.55295 9.91286L9.69438 9.74571C10.4658 8.89714 10.8901 7.80429 10.8901 6.69857V4.41C10.8901 1.98 8.93581 0 6.54438 0C6.40117 0 6.26904 0.0110773 6.12742 0.0229499C6.11647 0.0238682 6.10546 0.0247912 6.09438 0.0257143C3.90866 0.244286 2.19866 2.27571 2.19866 4.60286V6.68571C2.19866 7.83 2.62295 8.91 3.39438 9.73286L3.54866 9.9L3.35581 10.0157C1.90295 10.8386 0.797235 12.1114 0.244378 13.59C-0.128479 14.6057 -0.0641931 15.6857 0.437235 16.4829ZM1.85152 14.6957C2.36531 12.6277 4.34196 11.1244 6.53797 11.1214C8.74677 11.1244 10.7106 12.6278 11.2244 14.7343C11.2244 15.48 10.6587 16.0586 9.92581 16.0586H3.15009C2.41724 16.0586 1.85152 15.48 1.85152 14.6957ZM4.11438 4.41C4.11438 3.04714 5.20724 1.94143 6.54438 1.94143C7.88152 1.94143 8.97438 3.04714 8.97438 4.41V6.69857C8.97438 8.06143 7.88152 9.16714 6.54438 9.16714C5.20724 9.16714 4.11438 8.06143 4.11438 6.69857V4.41ZM14.6572 10.0414C16.0843 10.8386 17.2157 12.1371 17.7686 13.6029L17.7557 13.6157C18.1414 14.6314 18.0643 15.7114 17.5629 16.5086C16.9714 17.46 15.9429 18.0257 14.8372 18.0257H12.7672C12.9472 17.8329 13.1143 17.6143 13.2557 17.3829C13.5 16.9843 13.6929 16.5471 13.7957 16.0843H14.8372C15.57 16.0843 16.1486 15.5057 16.1486 14.7729C15.7243 13.0629 14.3486 11.7514 12.6772 11.3143C12.2272 10.6457 11.6743 10.0414 11.0572 9.52714C11.1214 9.41143 11.1729 9.29572 11.2243 9.18001L11.2243 9.18C11.3014 9.19286 11.3786 9.19286 11.4557 9.19286C12.7929 9.19286 13.8857 8.08714 13.8857 6.72429V4.42286C13.8857 3.07286 12.7929 1.95429 11.4557 1.95429C11.3657 1.95429 11.3014 1.95429 11.2243 1.96714C10.9414 1.32429 10.5557 0.745714 10.08 0.244286C10.3757 0.128571 10.6843 0.0642857 11.0057 0.0257143C11.16 0 11.3143 0 11.4557 0C13.86 0 15.8143 1.98 15.8014 4.42286V6.72429C15.8014 7.83 15.3772 8.91 14.6057 9.77143L14.4643 9.93857L14.6572 10.0414Z"
      fill={getColor(color) || color}
      fill-opacity="1"
      />
  </Svg>
  );
}
