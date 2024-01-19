import vars from "../../styles/vars";
import { StyleSheet } from "react-native";

export const styles: any = StyleSheet.create({
  base: {
    borderRadius: 999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    border: "none",
    height: 36,
    paddingRight: 20,
    paddingLeft: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  baseText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Mukta-SemiBold",
  },
  buttonIconContainer: {
    flexDirection: "row",
  },
  rightIcon: {
    marginLeft: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  isTextAtEnd: {
    justifyContent: "flex-end",
  },

  // button background color
  blue: {
    backgroundColor: vars["accent-blue"],
  },
  "light-blue": {
    backgroundColor: vars["primary-blue"],
  },
  grey: {
    backgroundColor: vars["light-grey"],
  },

  // light grey
  "text-grey": {
    color: vars["medium-grey-lighter"],
  },

  "text-black": {
    color: vars["black"],
  },
  // light blue
  "text-light-blue": {
    color: vars["accent-blue"],
  },
  "selected-light-blue": {
    backgroundColor: vars["accent-blue"],
  },
  "text-selected-light-blue": {
    color: "white",
  },

  // light pink
  "light-pink": {
    backgroundColor: vars["light-pink"],
  },
  "text-light-pink": {
    color: vars["accent-pink"],
  },
  "selected-light-pink": {},
  "text-selected-light-pink": {},

  // green
  green: {
    backgroundColor: vars["green"],
  },
  "text-green": {
    color: "white",
  },
  "selected-green": {
    backgroundColor: vars["accent-green"],
  },
  "text-selected-green": {
    color: "white",
  },

  // only text - blue
  "blue-only": {
    backgroundColor: "none",
  },
  "text-blue-only": {
    color: vars["accent-blue"],
  },
  withLineText: {
    borderBottomColor: vars["accent-blue"],
  },

  // only text - black
  "black-only": {
    backgroundColor: "aliceblue",
  },
  "text-black-only": {
    color: "#000000",
  },
});
