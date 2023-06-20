import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  small: {
    height: 36,
    width: 36,
  },
  medium: {
    width: 56,
    height: 56,
  },
  large: {
    width: 75,
    height: 75,
  },
  hasIcon: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 999,
    position:"relative"
  },

  iconButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 0,
  },
});
