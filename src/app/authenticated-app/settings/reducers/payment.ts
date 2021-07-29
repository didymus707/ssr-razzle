import { paymentSlice } from '../slices';

export const {
  setCardsLoading,
  setCards,
  setChangeDefaultCardLoading,
  setDeleteCardLoading,
  removeDeleteCardLoading,
  removeCard,
  setCardFormLoading,
  setBanks,
  setBankAccount,
  setBankAccounts,
  setBanksLoading,
  setBankAccountFormLoading,
  setBankAccountsLoading,
  setDeleteBankAccountLoading,
  removeDeleteBankAccountLoading,
  removeBankAccount,
  setCampaignCredit,
  setWalletID,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
