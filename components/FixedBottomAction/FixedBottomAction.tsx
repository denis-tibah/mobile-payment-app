import { View } from "react-native";
import { styles } from "./styles";

export function FixedBottomAction({
  children,
  rounded = false,
  smallMargin = false,
}:any) {
  return (
    <View
      style={[
        styles.base,
        rounded && styles.rounded,
        smallMargin && styles.smallMargin,
      ]}
    >
      {children}
    </View>
  );
}
