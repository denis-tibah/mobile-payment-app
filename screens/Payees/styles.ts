import { StyleSheet } from "react-native";
import vars from "../../styles/vars";
import { hp, wp } from "../../utils/helpers";

export const styles: any = StyleSheet.create<any>({
  heading: {
    marginTop: 26,
    zIndex: 1,
  },
  input: {
    backgroundColor: "white",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomColor: "rgb(221, 221, 221)",
    borderBottomWidth: 1,
  },
  listHead: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    paddingTop: 24,
    paddingBottom: 12,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingTop: 25,
    paddingHorizontal: 10,
  },
  headerText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 16,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
  },
  headerLeftIcon: {
    /* height: wp(23),
    width: wp(23), */
    height: 40,
    width: 40,
    padding: 12,
    /* borderRadius: wp(23), */
    borderRadius: 100,
    /* top: hp(-2.7),
    margin: 7, */
    backgroundColor: "#F5F9FF",
    /* padding: wp(7.5), */
  },
  dropdown: {
    width: "93%",
    height: 52,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: vars["accent-blue"],
    borderWidth: 1,
    borderRadius: 40,
  },
  dropdownContainer: {
    width: "93%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 0,
    borderRadius: 40,
  },
  textConfirmation: {
    fontSize: 14,
    color: vars["accent-grey"],
    alignSelf: "center",
    fontWeight: "400",
    paddingTop: 6,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 20,
    right: -45,
  },
  noCodeResend: {
    color: vars["accent-pink"],
    fontSize: 12,
    fontWeight: "400",
    marginTop: 12,
    textAlign: "center",
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: "#0DCA9D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    width: "100%",
    height: 75,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  buttonOK: { backgroundColor: "#fff", height: 30, width: 90, marginTop: 24 },
  image: {
    height: 200,
    width: 180,
    marginTop: 46,
    marginLeft: 90,
  },
  sendButton: {
    position: "relative",
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: "#ACACAC",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  buttonConfirmPayment: {
    width: "90%",
    bottom: 0,
    position: "relative",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
});
