import { Path } from "react-native-svg";
import { StyleSheet } from "react-native";
import vars from "../../styles/vars";
import { hp } from "../../utils/helpers";

export const styles = StyleSheet.create({
  dropdownWrapper: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    borderColor: vars["accent-blue"],
    borderRadius: 50,
    borderWidth: 1,
    overflow: "hidden",
    width: "100%",
    height: 45,
  },
  dropDownIconContainerLeft: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 20,
    paddingTop: 13,
  },
  dropDownIconContainerRight: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  dropDownIconContainerRightDOB: {
    position: "absolute",
    right: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dropdown: {
    backgroundColor: "#fffff",
    borderColor: "transparent",
    overflow: "hidden",
    marginTop: -5,
  },
  dropdownContainer: {
    width: "100%",
    borderColor: "transparent",

    marginTop: 0,
    paddingTop: 0,
    top: 0,
    left: -25,
    borderRadius: 0,
    position: "relative",
  },
  formContainer: {},
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
    /* position: "relative",
    bottom: -hp(20), */
  },
  downloadBtnMain: {
    width: "100%",
    paddingBottom: 16,
    paddingTop: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  separatorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  addressHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    marginBottom: 20,
  },
  toggleSliderContainer: {
    /* marginLeft: 12,
    marginRight: 12, */
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  toggleSliderContainerText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  containerButtonHelp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 14,
  },
  dobWrapper: {
    width: "100%",
    height: 42,
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
    borderColor: vars["accent-blue"],
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 16,
    paddingRight: 12,
  },
  dobText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "400",
  },
  dobTextSelected: {
    color: "black",
  },
  dobTextDefault: {
    color: vars["medium-grey"],
  },
  shadowBorder: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  listHead: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
});
