import { StyleSheet } from "react-native"

export const styles:any = StyleSheet.create<any>({
  container: {
    marginTop: 26,
    zIndex:1,
  },
  containerBottomSheetHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#F5F9FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 0,
  },
  containerDate: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconFilter: {
    height: 34,
    width: 34,
    padding: 10,
    backgroundColor: '#F5F9FF',
    borderRadius: 20,
  },
  dateRange: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: 10,
  
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
    padding: 10,
    zIndex: 100
  },
  bgWhite: {
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
    zIndex: 100
  },
  dropdownContainer: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
    borderColor: "transparent",
  },
  dropdownContainerStatus: {
    width: "78%",
    // alignSelf: "center",
    backgroundColor: "#f9f9f9",
    borderColor: "transparent",
  },
  arrow: {
    marginLeft: -60,
  },
  dropdownIOSFrom: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    minWidth: 330,
    marginLeft: -150,
  },
  dropdownIOSTo: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    minWidth: 330,
    marginLeft: -300,
  },
})
