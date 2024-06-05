import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 18,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOffset: { width: -2, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 99,
    elevation: 10,
  },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  action__iconMargin: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: {
    height: 36,
    width: 36,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F9",
    borderRadius: 999,
  },
  footerContent: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 8,
    padding: 8,
  },
  downloadBtnMain: {
    width: "100%",
    paddingBottom: 16,
    display: "flex",
    alignItems: "center",
  },
  notificationContainer: {
    height: 36,
    width: 36,
    padding: 10,
    backgroundColor: "#F5F9FF",
    borderRadius: 20,
  },
  headerAlertCounterStyle: {
    position: "absolute",
    bottom: -6,
    right: -5,
    height: 20,
    width: 20,
    backgroundColor: "#E7038E",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
});
