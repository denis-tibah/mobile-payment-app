import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  container: {
    marginBottom: 48,
  },
  keyboard: {
    backgroundColor: "transparent",
  },
  innerContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    /* paddingTop: 40, */
    paddingTop: 10,
  },
  card: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 20,
  },
  cardTitle: {
    paddingTop: 20,
    paddingBottom: 26,
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
  cardBody: {},
  cardBodyLink: {
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row-reverse",
  },
  cardBodyLinkMargin: {
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
  },
});
