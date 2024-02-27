import { StyleSheet } from "react-native";
import { hp } from "../../utils/helpers";

export const styles: any = StyleSheet.create<any>({
  heading: {
    // marginTop: 26,
    zIndex: 1,
  },
  content: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  footerContent: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowColor: "black",
    elevation: 8,
    padding: 8,
  },
  downloadBtnMain: {
    width: "100%",
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 8,
    paddingRight: 8,
  },
  downloadBtn: {
    width: 200,
    padding: 14,
  },
  dateContainer: {
    backgroundColor: "#ffffff",
    // paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
    height: hp(46),
    display: "flex",
    flexDirection: "column",
  },
  buttonDate: {
    width: 110,
    backgroundColor: "grey",
    marginTop: 10,
    lineHeight: 25,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  datePicker: {
    display: "flex",
    flexDirection: "row",
  },
});
