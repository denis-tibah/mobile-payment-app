import { atom } from "jotai";

export const helpTabticketParams = atom({
  tabSelectionRoute: "",
  isOpenBottomSheet: false,
  passedTicketType: "",
  transactionReferenceNumber: "",
});