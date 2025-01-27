import { Path } from "react-native-svg";
import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 20,
    width: "100%",
  },
  sumSubCard: {
    borderRadius: 20,
    backgroundColor: "white",
    overflow: "hidden",
    width: "100%",
  },
  cardTitle: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  cardBody: { padding: 12, paddingRight: 12 },
  emailVerifiedContainer: {
    alignItems: "center",
    marginTop: 5,
    padding: 24,
  },
  emailContainer: {
    backgroundColor: vars["accent-pink"],
  },
  emailVerifiedText: {
    color: "#fff",
  },
  emailVerifiedTextBlue: {
    color: vars["accent-pink"],
  },
  changeEmailTextContainer: {
    marginTop: 20,
  },
  changeEmailText: {
    marginLeft: 20,
    color: vars["accent-blue"],
  },
  alternateEmailContainer: {
    marginTop: 20,
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
  textSeparator: {
    fontSize: 12,
  },
  textSeparatorContainer: {
    marginTop: 10,
  },
  termsHeaderText: {
    color: "#696F7A",
    fontFamily: "Mukta-Regular",
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 24,
    marginBottom: 18,
  },
  pinCodeContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    textAlign: "center",
  },
  accentPinkText: {
    color: vars["accent-pink"],
  },
  noCode: {
    color: vars["accent-pink"],
    fontSize: 14,
    fontWeight: "400",
    marginTop: 24,
  },
  phoneNumberContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 24,
    padding: 24,
  },
  phoneNumberInnerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  alternatePhoneNumberContainer: {
    paddingTop: 0,
    paddingBottom: 24,
    paddingLeft: 24,
    padding: 24,
  },
  smsResentContainer: {},
  textmonthYearAdditionalText: {
    textAlign: "center",
    marginTop: 20,
    width: "100%",
    color: vars["medium-grey2"],
  },
  smsResentInnerContainer: {
    flexDirection: "column",
    margin: 20,
  },
  smsResentText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
  },
  smsResentFirstText: {
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: "#fffff",
    borderColor: "transparent",
    overflow: "hidden",
    marginTop: -5,
  },
  dropdownMonthYears: {},
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
  dropdownContainerMonthYears: {
    left: 0,
    top: -35,
    height: 130,
    marginBottom: -40,
  },
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
    /* paddingLeft: 20, */
    paddingLeft: 14,
    paddingTop: 13,
  },
  dropDownIconContainerRight: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  bottomButtonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemLabelStyle: {
    textAlign: "center",
    color: "#086AFB",
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 0,
    marginBottom: 0,
  },
  selectedItemLabelStyle: {
    color: "#fff",
    backgroundColor: "#086AFB",
    borderRadius: 50,
  },
  allContainerMonthsYears: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
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
    paddingVertical: 8,
    marginTop: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  downloadBtnMain: {
    width: "100%",
    paddingBottom: 16,
    paddingTop: 16,
  },

  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 6,
  },
});
