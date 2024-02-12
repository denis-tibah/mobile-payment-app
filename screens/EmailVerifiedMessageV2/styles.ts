import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles: any = StyleSheet.create<any>({
  container: {
    position: "absolute",
    top: 71,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255, 0.8)",
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  contentWrapper: {
    height: 380,
  },
  headerContainer: {
    backgroundColor: "#0DCA9D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    width: "100%",
    height: 75,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  okWrapper: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonOK: { backgroundColor: "#fff", height: 30, width: 90, marginTop: 24 },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  image: {
    height: 200,
    width: 180,
    marginTop: 46,
    marginLeft: 90,
  },
});
