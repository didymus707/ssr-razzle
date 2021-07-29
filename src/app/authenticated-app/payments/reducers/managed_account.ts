import { managedAccountSlice } from '../slices';

export const {
  setManagedAccountData,
  setManagedAccountLoading,
  setManagedAccountTransactionsLoading,
  setManagedAccountTransactionsData,
} = managedAccountSlice.actions;

export const managedAccountReducer = managedAccountSlice.reducer;
