import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  container: {
    marginBottom: 48,
  },
  keyboard: {
    backgroundColor: "transparent",
  },
  innerContainer: {
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
  headerContainer: {
    backgroundColor: "#0DCA9D",
    /* borderTopLeftRadius: 20,
    borderTopRightRadius: 20, */
    width: "100%",
    /* height: 75, */
    paddingBottom: 16,
    paddingTop: 4,
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
  buttonOK: {
    height: 30,
    width: 90,
    marginTop: 14,
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  image: {
    height: 200,
    width: 180,
    marginTop: 24,
    marginLeft: 90,
  },
});
