import { View } from "react-native";
import Typography from "../Typography";
import { styles } from "./style";

export function Heading({ icon, children, title, rightAction, leftAction }: any) {
  return (
    <View style={styles.base}>
      {leftAction && !rightAction && <View style={styles.leftAction}>{leftAction}</View>}
      <View style={styles.innerContainer}>
        <View style={styles.icon}>{icon && icon}</View>
        <Typography
          fontFamily="Nunito-SemiBold"
          fontWeight={600}
          fontSize={18}
        >
          {title}
        </Typography>
      </View>
      {children && <View> {children} </View>}
      {rightAction && !leftAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
}
