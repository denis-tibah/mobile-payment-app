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
  },
});
