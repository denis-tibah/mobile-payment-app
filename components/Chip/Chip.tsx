import { View, Text } from "react-native"
import { styles } from "./styles"

export function Chip({ color, label }:any) {
  return (
    <View style={[styles.chipContainer, color && styles[color] || styles['primary']]} >
      <Text style={styles.chipContainerSpan}>{label}</Text>
    </View>
  )
}
