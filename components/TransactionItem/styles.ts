import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles:any = StyleSheet.create<any>({
  base: {
    backgroundColor: "white",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: vars["light-grey"],
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    // paddingRight: 12,
    paddingRight: 68,
    justifyContent: "space-between",
    borderTopColor: vars["light-grey"],
    borderTopWidth: 1,
  },
  cell: {

    paddingLeft: 25,
    paddingRight: 10
  
  },
  cardCell: {

    paddingLeft: 2,
    // paddingRight: 20
  
  },
  arrowCell: {

    paddingLeft: 15,
  
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
    top: 0,
    right: 0,
    paddingTop:23,
  },
  detailMobile: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  detailMobileForEachTransactionContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 12,
    border: '1px solid #E5E5E5',
  },
  detailMobileForEachTransactionWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingRight: 48,
  },
  nameDetailMobile: {
    color: "#086AFB",
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    paddingRight: 10,
  },
  valueDetailMobile: {
    color: "#000000",
    fontSize: 14,
  },
  amountDetailMobile: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    alignSelf: 'flex-end',
    marginTop: -5
  },
  amountAddedDetail: {
    color: 'green'
  },
  amountDeductedDetail: {
    color: 'red'
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
    // marginLeft: 30,
    // paddingRight: -30,
  },
  currencyIcon: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    marginTop: 20
    // paddingTop: 30

  }
});
