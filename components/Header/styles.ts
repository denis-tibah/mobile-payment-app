import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 18,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOffset: { width: -2, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1,
    elevation: 10,
  },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  action__iconMargin: {
    marginRight: 16,
  },
});
