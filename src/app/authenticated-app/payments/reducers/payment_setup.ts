import { paymentSetupSlice } from '../slices';

export const {
  setPaymentSetupData,
  setPaymentSetupLoading,
  setPaymentSetupUpdateLoading,
} = paymentSetupSlice.actions;

export const paymentSetupReducer = paymentSetupSlice.reducer;
