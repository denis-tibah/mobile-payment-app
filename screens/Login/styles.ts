import { StyleSheet } from "react-native";
import vars from "../../styles/vars";

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
  cardTitleHeader: {},
  cardTitleSubheader: {
    paddingTop: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardBodyLink: {
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row-reverse",
  },
  cardBodyLinkMargin: {
    marginTop: 8,
  },
  passwordField: {
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: 25,
    top: "25%",
  },
  footer: {
    marginTop: 40,
  },
  signinButton: {
    height: 36,
    width: 340,
  },
  faceIdContainer: {
    borderTopWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: vars["light-grey"],
  },
  faceIdIconContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
});
