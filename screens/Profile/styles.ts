import { StyleSheet } from "react-native";

export const styles:any = StyleSheet.create<any>({
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
  tabDropDown: {
    paddingLeft: 24,
    paddingRight:24, 
    paddingBottom: 24,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  notification__switch: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
  },
  notification__switch__text: {
    flexDirection: "row",
    gap:8,
    alignItems: "center",
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
  buttonBox: {
    flexDirection: "row",
    marginTop: 18,
    gap:13,
    marginLeft:23
  },
  wrapper: {
      width: "100%",
      height: 42,
      backgroundColor: "#f9f9f9",
      borderRadius: 999,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 12,
      paddingRight: 12,
  },
  picker: {
    width: "100%",
    backgroundColor: "rgba(201, 201, 201, 0)",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 18,
    height: "100%",
    color: "#000"
  },
  dropdown: {
    // borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f9f9f9',
  },
  dropdownContainer: {
    zIndex: 1, // 1 for stacking the element on top of the previous element and -1 
    // for stacking the element under the above previous element.
    elevation: 1,
    width: "100%",
    // height: 42,
    backgroundColor: "#f9f9f9",
    // borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 12,
        
  },
  txtArea: {
    // marginTop:90,
    width: "95%",
    height:"58%",
    paddingTop: 20,
    paddingBottom:10,
    marginLeft:10,
    borderRadius:30,
    backgroundColor: "#f9f9f9",
    zIndex: -1, // 1 for stacking the element on top of the previous element and -1 
               // for stacking the element under the above previous element.
    elevation: -1,
  },
box: {
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 48,
    width: 48,
    borderRadius: 8,
},
overlay: {
  borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 48,
    width: 48,
    borderRadius: 8,
    zIndex: -1, // 1 for stacking the element on top of the previous element and -1 
                // for stacking the element under the above previous element.
    elevation: -1,
}
  
});
