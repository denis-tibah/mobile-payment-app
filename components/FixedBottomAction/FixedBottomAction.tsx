import { View } from "react-native";
import { styles } from "./styles";

export function FixedBottomAction({
  children,
  rounded = false,
  smallMargin = false,
  isFullWidth = false,
  isNoTopMargin = false,
}: any) {
  return (
    <View
      style={[
        styles.base,
        rounded && styles.rounded,
        smallMargin && styles.smallMargin,
        isFullWidth && styles.fullWidth,
        isNoTopMargin && styles.noTopMargin,
      ]}
    >
      {children}
    </View>
  );
}
