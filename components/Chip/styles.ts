import { StyleSheet } from "react-native"
import vars from "../../styles/vars"

export const styles:any = StyleSheet.create({
  chipContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    height: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  chipContainerSpan: {
    fontSize: 10,
    color:"white"
  },
  primary: {
    backgroundColor: vars["primary-blue"],
    color: vars["accent-blue"],
  },
  red: {
    backgroundColor: vars.red,
    color: "white",
  },
  green: {
    backgroundColor: vars.green,
    color: "white",
  },
  orange: {
    backgroundColor: vars.orange,
    color: "white",
  },
})
