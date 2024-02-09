import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 26,
    paddingBottom: 17,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: -1, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 9,
    elevation: 5,
  },
  title: {
    fontStyle: "normal",
    fontSize: 18,
    paddingLeft: 8,
    paddingTop: 0,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    // paddingTop: 26,
    // paddingBottom: 17,
    // paddingLeft: 12,
    // paddingRight: 12,
    backgroundColor: "white",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  rightAction: {
    marginLeft: "auto",
  },
});
