import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles: any = StyleSheet.create<any>({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingVertical: "2%",
    paddingHorizontal: 5,
  },
  container: {
    // marginTop: 26,
    zIndex: 1,
  },
  noCode: {
    color: vars["accent-pink"],
    fontSize: 14,
    fontWeight: "400",
    marginTop: 12,
    textAlign: "center",
  },
  // listHead: {
  //   backgroundColor: "white",
  //   display: "flex",
  //   flexDirection: "row",
  //   paddingTop: 24,
  //   paddingBottom: 12,
  //   paddingHorizontal: 24,
  //   justifyContent: "space-between",
  //   borderBottomColor: vars.grey,
  //   borderBottomWidth: 1,
  // },
  // listItem: {
  //   backgroundColor: "white",
  //   display: "flex",
  //   flexDirection: "row",
  //   paddingTop: 24,
  //   paddingBottom: 12,
  //   paddingHorizontal: 24,
  //   justifyContent: "space-between",
  //   textAlign: 'left',
  //   borderBottomColor: vars.grey,
  //   borderBottomWidth: 1,
  // },
  cardActionsListContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  cardActionItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  listItemInnerText: {
    textAligjt: "left",
    width: "40%",
    color: "#fd7a7a",
  },
  cardSection: {
    backgroundColor: "white",
  },
  cardImages: {
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 99,
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
    marginLeft: 12,
    display: "flex",
    flexDirection: "row",
  },
  cardActionsButtonMargin: {
    marginRight: 8,
    flex: 1,
  },
  cardTransactions: {
    marginTop: 24,
  },
  clipboardContainer: {
    position: "absolute",
    bottom: 130,
    left: 70,
  },
  listHeadCardTransactions: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    borderBottomColor: vars.grey,
    borderBottomWidth: 1,
  },
  listCardTransactions: {
    textAlign: "left",
    backgroundColor: "white",
    display: "flex",
    // paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 20,
    paddingHorizontal: 5,
    justifyContent: "space-between",
    borderBottomColor: vars.grey,
    borderBottomWidth: 1,
  },
  headerTitleBoxTerminateModal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  headerTitleTerminateModal: {
    fontSize: 24,
    fontWeight: "bold",
    color: vars.black,
  },
  buttonContainerTerminateModal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
