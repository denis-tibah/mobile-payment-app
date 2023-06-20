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
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: "space-between",
    borderTopColor: vars["light-grey"],
    borderTopWidth: 1,
  },
  cell: {},
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
    fontSize: 14,
  },
  valueDetailMobile: {
    color: "#000000",
    fontSize: 14,
  },
  detailMobileWrapper: {},
  cardDetails: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 25,
    paddingBottom: 25,
  },
  detailMobile: {
    marginBottom: 12,
  },
  iban: {
    width: "65%",
  },
  bic: {
    width: "35%",
  },
  downloadContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  isOpen: {
    backgroundColor: "#f8fbff",
  },
  rowFront: {
    // Add your styles for the front side of the row
  },
});
