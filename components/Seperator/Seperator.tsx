import { View, ViewStyle } from "react-native";
import {styles} from './styles'

export function Seperator(style:ViewStyle) {
    return <View style={[style, styles.seperator]} />
}