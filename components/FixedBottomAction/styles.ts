import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  base: {
    height: 84,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    paddingLeft: 24,
    marginTop: 40,
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
});
