import { StyleSheet } from "react-native";

export const styles:any = StyleSheet.create<any>({
  container: {
    marginTop: 26,
    zIndex:1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: "white",
  },
  content: {
    backgroundColor: "white",
    paddingTop: 12,
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
});
