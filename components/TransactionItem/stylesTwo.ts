import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles: any = StyleSheet.create({
  base: {
    backgroundColor: "#FFFFFF",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: vars["light-grey"],
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 68,
    marginVertical: 2,
    justifyContent: "space-between",
    borderTopColor: vars["light-grey"],
    borderTopWidth: 1,
  },
  cell: {
    paddingLeft: 25,
    paddingRight: 10,
  },
  cardCell: {
    paddingLeft: 2,
    // paddingRight: 20
  },
  arrowCell: {
    paddingLeft: 15,
    justifyContent: "flex-end",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: vars["primary-blue"],
    margin: 0,
  },
  rowDetail: {
    backgroundColor: "#F8FBFF",
    padding: 24,
    position: "relative",
  },
  detailMobileContainer: {
    display: "flex",
    flexDirection: "row",
  },
  statusItem: {
    position: "absolute",
    bottom: 50,
    right: 50,
    paddingTop: 23,
  },
  detailMobile: {
    marginLeft: 12,
    display: "flex",
    flexDirection: "column",
    /* flexWrap: "nowrap", */
    flexFlow: "column wrap",
    width: "100%",
  },
  marginerDetailMobile: {
    marginBottom: 12,
  },
  detailMobileInnerDetail: {
    flex: 1,
  },
  detailMobileForEachTransactionContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 12,
    border: "1px solid #E5E5E5",
  },
  detailMobileForEachTransactionWrapper: {
    display: "flex",
    flexDirection: "row",
    /* flexWrap: "wrap", */
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  nameDetailMobile: {
    color: "#086AFB",
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    paddingRight: 10,
    fontWeight: "600",
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "600",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: "Mukta-SemiBold",
    borderRadius: 15,
  },
  transactionStatusHasLineThrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  valueDetailMobileStatusSuccess: {
    color: "#0DCA9D",
    backgroundColor: "#E7FAF5",
  },
  valueDetailMobileStatusFailed: {
    color: "#FF7171",
    backgroundColor: "#FFEDED",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "65%",
    paddingRight: 16,
    gap: 6,
  },
  valueDetailMobile: {
    color: "#000000",
    fontSize: 14,
  },
  amountDetailMobile: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  amountAddedDetail: {
    color: "green",
  },
  amountDeductedDetail: {
    color: "red",
  },
  detailMobileWrapper: {},
  cardDetails: {
    paddingTop: 25,
    paddingBottom: 25,
  },

  downloadContainer: {
    marginTop: 24,
    flexDirection: "row",
  },
  isOpen: {
    backgroundColor: "#f8fbff",
  },
  amuntWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  eurosign: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  cardpayments: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  currencyIcon: {
    marginTop: 20,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    gap: 30,
    marginLeft: 12,
  },
  cardContentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  containerDetailsInfo: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    borderTopColor: "#DDD",
    borderTopWidth: 1,
    /* borderTopBottomColor: "green",
    borderBottomWidth: 1, */
    paddingTop: 16,
    paddingBottom: 28,
  },
});
