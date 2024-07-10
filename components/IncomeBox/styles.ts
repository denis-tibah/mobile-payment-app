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
  incomeBox__box__title1: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -35,
  },
  incomeBox__box__title2: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -20,
  },
  incomeBox__box__bic: {
    display: "flex",
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -20,
  },
  incomeBox__box__iban: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -10,
  },
  incomeBox__box__balances: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -10,
  },
});
