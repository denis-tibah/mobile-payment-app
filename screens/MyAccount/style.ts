import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  listHead: {
    /* backgroundColor: "white", */
    display: "flex",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    // paddingTop: 12,
    // paddingBottom: 12,
    // paddingLeft: 20,
    // paddingRight: -30,
    justifyContent: "space-between",
  },
  /*   currentBalanceShadow: {
    borderBottomWidth: 6,
    borderBottomColor: "#E7038E",
    paddingRight: 25,
  }, */
  /*   pendingBalanceShadow: {
    borderBottomWidth: 6,
    borderBottomColor: "#FBB445",
    paddingRight: 25,
  }, */
  /*   availableBalanceShadow: {
    borderBottomWidth: 6,
    borderBottomColor: "#0DCA9D",
    paddingRight: 25,
  }, */
  /*   totalBalance: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "left",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 14,
  }, */
  /*   balanceContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 5,
  }, */
  balancesTitleA: {
    // padding: 12,
    paddingTop: 15,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
    // backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -93,
    marginLeft: 10,
    marginRight: 14,
    marginBottom: 25,
    // margin: 12,
    // borderRadius: 20,
  },
  balancesTitleB: {
    padding: 12,
    // paddingBottom: 30,
    // backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -60,
    marginLeft: 10,
    marginRight: 8,
    marginBottom: 20,
    // margin: 12,
    // borderRadius: 20,
  },
  balances: {
    // padding: 12,
    paddingTop: 12,
    paddingLeft: 13,
    paddingRight: 10,
    paddingBottom: 12,
    gap: 5,
    // paddingBottom: 30,
    // backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -50,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    // margin: 12,
    // borderRadius: 20,
  },
  base: {
    backgroundColor: "white",
    zIndex: 1,
  },
  dateLabel: {
    paddingLeft: 30,
    display: "flex",
    flexDirection: "row",
  },
  arrow: {
    paddingTop: 5,
    marginLeft: 7,
  },
  amountLabel: {
    paddingLeft: 10,
  },
  balanceLabel: {
    // paddingLeft: -20,
    paddingRight: 10,
  },
  paginateContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  paginateArrowContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  paginateTextNextPrev: {
    marginBottom: 2,
  },
  /*   balanceFirstThird: {
    flexGrow: 1.9,
  }, */
  /*   pendingBalance: {
    flexGrow: 1.1,
  }, */
  balancesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    margin: 10,
  },
  balanceItem: {
    backgroundColor: "white",
    flexShrink: 1,
    borderRadius: 14,
    borderBottomWidth: 6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
  },
  accordionBodyContainer: {
    backgroundColor: "#F5F9FF",
    shadowOpacity: 0.1,
    elevation: 20,
    shadowColor: "#000",
  },
});
