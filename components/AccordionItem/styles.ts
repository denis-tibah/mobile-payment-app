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
    /* elevation: 20,
    shadowColor: "#000", */

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  accordTitle: {
    fontSize: 20,
  },
  accordBody: {},
  textSmall: {
    fontSize: 16,
  },
  seperator: {
    height: 12,
  },
});
