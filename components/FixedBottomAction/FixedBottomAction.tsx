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
        {
          // drop shadow
          // boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          shadowColor: "#0000001A",
          shadowOpacity: 0.75,
          shadowRadius: 6,
          shadowOffset: {
            height: 2,
            width: 0,
          },
        }
      ]}
    >
      {children}
    </View>
  );
}
