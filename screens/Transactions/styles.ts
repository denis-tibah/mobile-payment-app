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
    display: 'flex',
    flexDirection: "row",
    backgroundColor: "white",
    height: 68,
    justifyContent: 'space-between',
    padding: 10
  },
  bgWhite: {
    backgroundColor: "white",
  }
})
