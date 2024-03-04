import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  container: {
    marginBottom: 48,
  },
  innerContainer: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 40,
  },
  card: {
    backgroundColor: "white",
    marginBottom: 26,
    borderRadius: 20,
  },
  cardTitle: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  footerContent: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowColor: "black",
    elevation: 8,
    paddingVertical: 8,
    marginTop: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  downloadBtnMain: {
    width: "100%",
    paddingBottom: 16,
    paddingTop: 16,
  },
  bottomButtonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
