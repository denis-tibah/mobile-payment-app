import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import LoadingIcon from "../../assets/icons/Loading";

export function Button({
  color,
  children,
  withLine,
  rightIcon,
  leftIcon,
  onPress,
  selected = false,
  loading = false,
  disabled = false,
  isTextAtEnd = false,
  style,
}: any) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          style,
          styles.base,
          disabled && styles.disabled,
          (rightIcon || leftIcon) && styles.buttonIconContainer,
          color && styles[color],
          selected && styles[`selected-${color}`],
          isTextAtEnd && styles.isTextAtEnd,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <Text
          style={[
            styles.baseText,
            color && styles[`text-${color}`],
            selected && styles[`text-selected-${color}`],
            withLine && styles.withLineText,
          ]}
        >
          {children}
        </Text>
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        {loading && (
          <View style={styles.rightIcon}>
            <LoadingIcon size={14} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
