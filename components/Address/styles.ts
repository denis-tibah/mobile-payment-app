import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  incomeBox: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: "white",
    marginBottom: 24,
    marginTop: 24,
  },
  incomeBox__group: {
    marginBottom: 16,
  },
  income__groupText: {
    justifyContent: "space-between",
    display: "flex",
  },
  content: {
    backgroundColor: "white",
    elevation: 10,
    shadowColor: "black",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
  },
  tabContent: {
    flex: 1,
    marginTop: 24,
    marginBottom: 74,
  },
  notification__switch: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
  },
  notification__action: {
    flexDirection: "row",
    marginTop: 24,
    paddingLeft: 12,
  },
  help__dropdown: {
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row",
  },
});
