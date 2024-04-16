import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    display: "flex",
  },
  creditCardImg: {
    position: "relative",
    width: 390,
    height: 230,
    // justifyContent: "center",
    // alignItems: "center",
    borderRadius: 25,
    // overflow: "hidden",
  },
  // card: {
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100%",
  //   height: "100%",
  // },
  overlay: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  timer: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    color: vars["accent-blue"],
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 16,
  },
  pin: {
    color: "#000",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
});
