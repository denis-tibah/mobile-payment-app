import { StyleSheet } from "react-native";

export const styles = StyleSheet.create<any>({
  cardContainer: {
    position: "relative",
    display: "flex",
  },
  creditCardImg: {
    position: "relative",
    width: 303,
    height: 191,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  timer: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    position: "absolute",
    top: 10,
    right: 10,
  },
});
