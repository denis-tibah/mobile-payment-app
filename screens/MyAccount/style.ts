import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  listHead: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    paddingTop: 24,
    paddingBottom: 12,
    paddingLeft: 19,
    // paddingTop: 12,
    // paddingBottom: 12,
    // paddingLeft: 20,
    // paddingRight: -30,
    justifyContent: "space-between",
  },
  totalBalance: {
    padding: 12,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 12,
    borderRadius: 20,
  },
  base: {
    backgroundColor: "white",
    zIndex:1,
  },
  dateLabel : {
    paddingLeft: 30,
  },
  amountLabel : {
    paddingLeft: 10,
  },
  balanceLabel : {
    // paddingLeft: -20,
    paddingRight: 10,
  },
});
