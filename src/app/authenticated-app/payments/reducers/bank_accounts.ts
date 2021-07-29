import { bankAccountsSlice } from '../slices';

export const {
  setBanksData,
  setBankAccountsData,
  setBankAccountsLoading,
  setBankAccountsCreateLoading,
  setBankAccountsUpdateLoading,
  setBankAccountsDeleteLoading,
} = bankAccountsSlice.actions;

export const bankAccountsReducer = bankAccountsSlice.reducer;
