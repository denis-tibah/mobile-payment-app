import { StyleSheet } from "react-native"

export const styles:any = StyleSheet.create<any>({
  container: {
    marginTop: 26,
    zIndex:1
  },
  listHead: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    paddingTop: 12,
    // paddingBottom: 12,
    // paddingLeft: 20,
    // paddingRight: 100,

    paddingBottom: 12,
    paddingLeft: 19,
    justifyContent: "space-between",
    
  },
  searchBar: {
    backgroundColor: "white",
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 8
  }
})
