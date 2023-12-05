import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

export const styles = StyleSheet.create({
  /*  header: {
    paddingTop: 24,
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
  }, */
  headerV2: {
    paddingTop: 24,
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
  /* scrollableContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 28,
    overflowX: "scroll",
  }, */
  scrollableContainerV2: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
    marginTop: 28,
  },
  scrollableItems: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  /* circleIndex: {
    height: 25,
    width: 25,
    borderRadius: 50,
    marginRight: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }, */
  circleIndexBg: { backgroundColor: vars["light-grey"] },
  circleIndexBgSelected: {
    backgroundColor: vars["accent-pink"],
  },
  circleIndexBgSelectedV2: {
    width: 24,
    backgroundColor: vars["light-grey"],
  },
  circleIndexV2: {
    height: 8,
    width: 8,
    borderRadius: 50,
    marginRight: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textScrollable: {
    color: vars["medium-grey"],
    fontFamily: "Nunito-Regular",
    fontWeight: "600",
  },
  textScrollableSelected: {
    color: "#000000",
    fontFamily: "Nunito-Regular",
    fontWeight: "600",
  },
  scrollableContainer: {
    alignSelf: "stretch",
    alignItems: "center",
    display: "flex",
  },
});
