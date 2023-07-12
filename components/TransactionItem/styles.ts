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
  },
  nameDetailMobile: {
    color: "#086AFB",
    fontFamily: "Nunito-Regular",
    fontSize: 14,
  },
  valueDetailMobile: {
    color: "#000000",
    fontSize: 14,
  },
  detailMobileWrapper: {},
  cardDetails: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  detailMobile: {
    marginBottom: 12,
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
  }
});
