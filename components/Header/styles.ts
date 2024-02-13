import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 18,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOffset: { width: -2, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 99,
    elevation: 10,
  },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  action__iconMargin: {
    /* marginRight: 14, */
  },
  iconContainer: {
    height: 36,
    width: 36,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F9",
    borderRadius: 999,
  },
});
