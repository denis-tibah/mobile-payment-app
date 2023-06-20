import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles:any = StyleSheet.create<any>({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
  },
  shadowBox: {
    backgroundColor: "white",
    width: "90%",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 48,
    shadowColor: "#000",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 24,
    paddingBottom: 24,
    width: "100%",
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: "center",
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
  },
  body: {
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
  },
  footer: {
    backgroundColor: "white",
    paddingTop: 26,
    paddingBottom: 22,
    paddingLeft: 24,
    paddingRight: 24,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.075,
    shadowRadius: 3,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
  },

  success: {
    backgroundColor: vars.green,
  },
  failed: {
    backgroundColor: vars.red,
  },
  info: {
    backgroundColor: vars["accent-blue"],
  },
});
