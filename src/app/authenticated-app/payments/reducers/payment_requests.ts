import { paymentRequestsSlice } from '../slices';

export const { setPaymentRequestsData, setPaymentRequestsLoading } = paymentRequestsSlice.actions;

export const paymentRequestsReducer = paymentRequestsSlice.reducer;
