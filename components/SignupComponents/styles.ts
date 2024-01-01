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
    paddingTop: 20,
    paddingBottom: 26,
    paddingLeft: 24,
    paddingRight: 24,
  },
  cardBody: {},
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
    marginLeft: 20,
  },
  textSeparatorContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  termsHeaderText: {
    color: vars["medium-grey"],
    fontFamily: "Mukta-SemiBold",
    fontWeight: "bold",
    fontSize: 16,
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
  noCode: {
    color: vars["accent-pink"],
    fontSize: 14,
    fontWeight: "400",
    marginTop: 24,
  },
  phoneNumberContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 24,
    paddingLeft: 24,
    padding: 24,
  },
  phoneNumberInnerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  alternatePhoneNumberContainer: {
    paddingTop: 0,
    paddingBottom: 24,
    paddingLeft: 24,
    padding: 24,
  },
  smsResentContainer: {
    /* backgroundColor: "#0dca9d", */
  },
  textmonthYearAdditionalText: {
    position: "absolute",
    top: 14,
    left: 12,
    color: "black",
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
    /* borderRadius: 99, */
    /* display: "flex",
    flexDirection: "row", */
    /* paddingLeft: 12, */
    /* width: "95%", */
    /* alignSelf: "center", */
    /* marginBottom: 40, */
    overflow: "hidden",
  },
  dropdownContainer: {
    width: "100%",
    /* backgroundColor: "#fffff", */
    borderColor: "transparent",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 0,
    top: 0,
    left: 0,
    borderRadius: 0,
    position: "relative",
  },
  dropdownWrapper: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    borderColor: vars["accent-blue"],

    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    width: "100%",
  },
});
