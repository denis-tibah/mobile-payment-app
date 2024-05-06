import { Text } from "react-native";
import vars from "../../styles/vars";

// fontFamily = Nunito-Regular | Nunito-SemiBold | Mukta-Regular | Mukta-Bold"
/* color =
| primary-blue
|  orange
|  green
|  red 
|  black
|  extra-light-grey
|  light-grey
|  light-grey 
|  light-pink
|  light-blue 
|  medium-grey-lighter
|  medium-grey 
|  medium-grey2
|  accent-blue
|  accent-pink
|  soft-pink 
*/

interface TypographyProps {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  children: any;
  color?: string;
  style?: any;
}

export function Typography({
  fontFamily,
  fontSize,
  fontWeight,
  children,
  color,
  style,
  ...props
}: any) {
  let convertedFontWeight = "";

  if (fontWeight) {
    if (typeof fontWeight === "string") {
      convertedFontWeight = fontWeight;
    } else {
      convertedFontWeight = fontWeight.toString();
    }
  }

  return (
    <Text
      style={{
        fontFamily: fontFamily ?? "Mukta-Regular",
        fontSize: fontSize ?? 14,
        fontWeight: convertedFontWeight || "normal",
        color: vars[color] ?? color,
        ...props,
      }}
    >
      {children}
    </Text>
  );
}
