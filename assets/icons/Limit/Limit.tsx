import { getColor } from "../color";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
export function Limit({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill={getColor(color) || color}
    >
      <G /* clipPath="url(#clip0_4976_5556)" */>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.87149 2.18571C9.47506 2.18571 9.96435 1.69643 9.96435 1.09286C9.96435 0.489289 9.47506 0 8.87149 0C8.26792 0 7.77863 0.489289 7.77863 1.09286C7.77863 1.69643 8.26792 2.18571 8.87149 2.18571ZM8.865 17.7943C3.98222 17.7908 0 13.8579 0 9.02571C0 8.44714 0.0514286 7.85571 0.167143 7.28999L1.8 7.62428C1.71 8.07428 1.65857 8.54999 1.65857 9.02571C1.65857 12.9343 4.88571 16.1229 8.85857 16.1229C12.8314 16.1229 16.0586 12.9343 16.0586 9.02571C16.0586 5.90142 14.0271 3.17571 11.0057 2.24999L11.4943 0.655707C15.2229 1.79999 17.73 5.16857 17.73 9.02571C17.73 13.8579 13.7478 17.7908 8.865 17.7943ZM8.85248 12.3043C8.85452 12.3043 8.85656 12.3043 8.8586 12.3043H8.84575C8.84799 12.3043 8.85023 12.3043 8.85248 12.3043ZM7.94575 12.1757C8.25228 12.2524 8.54612 12.3036 8.85248 12.3043C9.69847 12.3026 10.4802 11.9813 11.07 11.3914C11.88 10.5814 12.1757 9.38572 11.8415 8.28C11.5072 7.18715 10.5943 6.36429 9.45003 6.13286L9.45002 6.13286C9.25717 6.10715 9.06431 6.08143 8.87146 6.08143C8.4086 6.08143 7.94575 6.19715 7.43146 6.44143L7.35432 6.48L3.98575 3.09858L2.76432 4.33286L3.26575 4.84715L6.05575 7.63715L6.08146 7.77858L6.04289 7.85572C5.76003 8.47286 5.67003 9.14143 5.7986 9.78429C6.01717 10.9157 6.84003 11.8286 7.94575 12.1757ZM7.47003 9.19286C7.47003 8.42143 8.08717 7.80429 8.8586 7.80429C9.42432 7.80429 9.92575 8.13858 10.1443 8.66572C10.35 9.18 10.2343 9.77143 9.8486 10.1571C9.59146 10.4271 9.24432 10.5686 8.87146 10.5686C8.6786 10.5686 8.4986 10.5429 8.33146 10.4657C7.81717 10.2471 7.47003 9.74572 7.47003 9.19286Z"
          fill={getColor(color) || color}
          fillOpacity="1"
        />
      </G>
      {/* <Defs>
        <ClipPath id="clip0_4976_5556">
          <Rect width={size} height={size} fill={getColor(color) || color} />
        </ClipPath>
      </Defs> */}
    </Svg>
  );
}
