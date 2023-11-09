import { StyleSheet } from "react-native";

export const styles:any = StyleSheet.create<any>({
  heading: {
    marginTop: 26,
    zIndex:1
  },
  input: {
    backgroundColor: "white",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomColor: "rgb(221, 221, 221)",
    borderBottomWidth: 1,
  },
  listHead: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    paddingTop: 24,
    paddingBottom: 12,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
