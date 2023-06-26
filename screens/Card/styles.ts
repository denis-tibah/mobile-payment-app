import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles: any = StyleSheet.create<any>({
  container: {
    marginTop: 26,
    zIndex: 1,
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
  cardSection: {
    backgroundColor: "white",
  },
  cardImages: {
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  incomeBox: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: "white",
    marginTop: 24,
  },
  incomeBox__group: {
    flexDirection: "row",
    display: "flex",
  },
  income__groupText: {
    justifyContent: "space-between",
    display: "flex",
  },
  cardActions: {
    backgroundColor: "white",
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 24,
  },
  cardActionsButtonMargin: {
    marginRight: 8,
  },
  cardTransactions: {
    marginTop: 24,
  },
  clipboardContainer: {
    position: "absolute",
    bottom: 62,
    right: -20,
  },
});
