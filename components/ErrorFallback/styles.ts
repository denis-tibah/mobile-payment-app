import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles = StyleSheet.create({
  header: {
    paddingTop: 34,
    paddingBottom: 18,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: -2, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1,
    elevation: 10,
  },
  container: {
    backgroundColor: "#fff",
    padding: 30,
    marginLeft: 10,
    marginRight: 10,
  },
});
