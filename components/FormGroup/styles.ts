import { StyleSheet, Platform } from "react-native";
import vars from "../../styles/vars";
export const textarea: any = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 296,
    backgroundColor: "#f9f9f9",
    borderRadius: 21,
    display: "flex",
    alignItems: "center",
    borderColor: vars["accent-blue"],
    borderWidth: 1,
  },
  input: {
    width: "100%",
    height: "100%",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 18,
    paddingRight: 18,
    textAlignVertical: "top",
    fontSize: 16,
  },
});

export const input = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: vars["accent-blue"],
  },
  wrapperSelectForObjectData: {
    width: "100%",
    height: 48,
    ...Platform.select({
      ios: {
        backgroundColor: "transparent",
      },
      android: {
        backgroundColor: "#f9f9f9",
        paddingLeft: 12,
        paddingRight: 30,
      },
    }),
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapperIOS: {
    overflow: "hidden",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(201, 201, 201, 0)",
    fontSize: 16,
    fontWeight: "400",
    /* lineHeight: 18, */
    height: "100%",
    color: "#000",
    flex: 1,
  },
  label: {
    color: "rgba(0,0,0,0.5)",
    marginBottom: 12,
    lineHeight: 14,
    flexDirection: "row",
  },
  icon: {
    marginRight: 8,
    marginLeft: 8,
    paddingTop: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  passIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});

export const pinCode = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 42,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  newPinCodeWrapper: {
    width: "85%",
  },
  input: {
    width: 36,
    height: 48,
    borderRadius: 6,
    padding: 10,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderColor: "#DDDDDD",
    alignContent: "center",
    textAlign: "center",
    borderWidth: 1,
  },
  newPinCodeStyle: {
    borderRadius: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#000000",
  },
});

export const newPinCode = StyleSheet.create({
  wrapper: {
    width: "70%",
    height: 42,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#6BA6FD",
  },
  Wrapper: {
    width: "85%",
  },
  input: {
    height: 48,
    margin: 0,
    ...Platform.select({
      ios: {
        padding: 12,
      },
      android: {
        padding: 6,
      },
    }),
    fontSize: 18,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  newPinCodeStyle: {
    borderRadius: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#000000",
  },
});

export const formGroup: any = StyleSheet.create<any>({
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: 15,
    paddingLeft: 12,
    paddingRight: 12,
  },
  row: {},
  noPadding: {},
  noMargin: {},
  extraPadding: {},
  validationError: {
    fontSize: 11,
    paddingLeft: 12,
    color: vars.red,
  },
  helperText: {},
  infoBlock: {
    height: 14,
    marginTop: 3,
  },
});

export const checkbox: any = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 14,
  },
  checkbox: {
    alignSelf: "center",
    marginLeft: 14,
  },
  label: {
    marginLeft: 6,
  },
});
