import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create<any>({
  tabBar: {
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
  },
  tab: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 12,
    paddingRight: 24,
    zIndex: 5,
    elevation: 5,
    backgroundColor: "white",
  },
  tabButtonMargin: {
    marginRight: 8,
  },
});
