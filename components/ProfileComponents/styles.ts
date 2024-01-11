import { Path } from "react-native-svg";
import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

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
  },
  downloadBtnMain: {
    width: "100%",
    paddingBottom: 12,
    paddingTop: 12,
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
    marginLeft: 12,
    marginRight: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  toggleSliderContainerText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
