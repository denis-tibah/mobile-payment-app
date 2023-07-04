import { View } from "react-native";
import Typography from "../Typography";
import { styles } from "./style";

export function Heading({ icon, children, title, rightAction }: any) {
  return (
    <View style={styles.base}>
      <View style={styles.icon}>{icon && icon}</View>
      <Typography
        fontFamily="Nunito-SemiBold"
        fontWeight={600}
        fontSize={18}
      >
        {title}
      </Typography>
      
      {children && <View> {children} </View>}
      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
}
