import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  paginateContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  paginateArrowContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  paginateTextNextPrev: {
    marginBottom: 2,
  },
});
