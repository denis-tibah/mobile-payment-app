import { atom } from "jotai";

export const helpTabticketParams = atom({
  tabSelectionRoute: "",
  isOpenBottomSheet: false,
  passedTicketType: "",
  transactionReferenceNumber: "",
});

export const profileTabRoute = atom("");

export const sessionToken = atom(null);
