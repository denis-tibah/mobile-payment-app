import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordContainer: {
    backgroundColor: "#fff",
  },
  accordHeader: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    color: "#eee",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 20,
    shadowColor: "#000",
  },
  accordTitle: {
    fontSize: 20,
  },
  accordBody: {
    /* paddingTop: 12,
    paddingBottom: 12, */
  },
  textSmall: {
    fontSize: 16,
  },
  seperator: {
    height: 12,
  },
});
