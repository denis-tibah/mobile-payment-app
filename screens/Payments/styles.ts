import { StyleSheet } from "react-native";

export const styles:any = StyleSheet.create<any>({
  container: {
    // marginTop: 26,
    zIndex:1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: "white",
  },
  content: {
    backgroundColor: "white",
  },
  dropdown: {
    height: 42,
    backgroundColor: "#f9f9f9",
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 12,
    width: "95%",
    alignSelf: "center",
    borderColor: "transparent",
    marginBottom: 18,
  },
  dropdownContainer: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
    borderColor: "transparent",
  },
  externalPayment__switch: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom:5,
    // paddingTop: -10,
  },
  externalPayment__switch__text: {
    flexDirection: "row",
    gap:8,
    alignItems: "center",
  },
  checkboxSavePayee: {
    flexDirection: "row",
    fontSize: 12,
    color: "#808080",
    backgrounColor: "white",
    paddingLeft: 12,
  }
});
