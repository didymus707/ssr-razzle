import { createSelector } from "reselect";
import { selectContactName } from "./contact";
import { selectCustomerName } from "./customer";
import { selectPlatformContactName } from "./platformContact";

export const selectName = createSelector(
  selectCustomerName,
  selectPlatformContactName,
  selectContactName,
  (customerName, platformContactName, contactName ) => (
    contactName || platformContactName || customerName
  ) as string
);