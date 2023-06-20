import { StyleSheet } from "react-native";

export const styles:any = StyleSheet.create<any>({
  container: {
    marginTop: 26,
    zIndex:1,
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
    paddingTop: 24,
    alignItems: "center",
    justifyContent: "center"
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
  }
});
