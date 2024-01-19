import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  base: {
    height: 84,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    /* shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4, */

    shadowOpacity: 1,
    shadowRadius: 18,
    shadowColor: "black",
    elevation: 18,

    paddingLeft: 24,
    marginTop: 40,
  },
  fullWidth: {
    paddingLeft: 0,
    justifyContent: "center",
    width: "100%",
  },
  rounded: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  smallMargin: {
    marginTop: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  noTopMargin: {
    marginTop: 0,
  },
  isNoPaddingLeft: { paddingLeft: 0 },
});
