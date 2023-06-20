import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  incomeBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBFF",
    gap: 22,
    marginBottom: 24,
    padding: 24,
  },
  incomeBox__row: {
    flexDirection: "row",
  },
  incomeBox__box: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  incomeBox__box__item: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
