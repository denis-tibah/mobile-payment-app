import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles = StyleSheet.create({
  dropshadow: {
    flexDirection: "column",
    gap: 1.27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: vars["light-blue"],
    width: 36,
    height: 36,
    borderRadius: 30,
  },
  dot: {
    width: 3.82,
    height: 3.82,
    borderRadius: 10,
    backgroundColor: vars["accent-blue"],
    alignItems: "center",
    zIndex: 3,
  },
  optionsContainer: {
    borderRadius: 5,
  },
  menuOption: {
    padding: 10,
    borderBottomColor: vars["medium-grey-lighter"],
    borderBottomWidth: 1,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
