import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingTop: 26,
    paddingBottom: 17,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "white",
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: "black",
    elevation: 4,
  },
  title: {
    fontStyle: "normal",
    fontSize: 18,
    paddingLeft: 8,
    paddingTop: 0,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 26,
    paddingBottom: 17,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "white",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  rightAction: {
    marginLeft: "auto",
  },
});
