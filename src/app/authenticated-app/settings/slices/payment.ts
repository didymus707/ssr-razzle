// @ts-nocheck
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';

const paymentInitialState = {
  cards: [],
  banks: [],
  bank_accounts: [],
  default_card: null,
  default_bank_account: null,
  cards_loading: false,
  banks_loading: false,
  bank_accounts_loading: false,
  bank_account_form_loading: false,
  card_form_loading: false,
  change_default_card_loading: null,
  delete_card_loading: [],
  delete_bank_account_loading: [],
  credit_balance: 0,
  wallet_id: null,
  wallet_email: null,
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState: paymentInitialState,
  reducers: {
    setDefaultCard: (state, action) => {
      const { default_card } = action.payload;
      state.default_card = default_card;
    },
    setCards: (state, action) => {
      const { cards } = action.payload;
      state.cards = cards;
      if (cards.length === 1) state.default_card = cards[0].id;
    },
    setCardsLoading: (state, action) => {
      const { loading } = action.payload;
      state.cards_loading = loading;
    },
    setChangeDefaultCardLoading: (state, action) => {
      const { card_id } = action.payload;
      state.change_default_card_loading = card_id;
    },
    setDeleteCardLoading: (state, action) => {
      const { card_id } = action.payload;
      state.delete_card_loading = [...state.delete_card_loading, card_id];
    },
    removeDeleteCardLoading: (state, action) => {
      const { card_id } = action.payload;
      state.delete_card_loading = state.delete_card_loading.filter(i => i !== card_id);
    },
    removeCard: (state, action) => {
      const { card_id } = action.payload;
      state.cards = state.cards.filter(i => i.id !== card_id);
    },
    setBanks: (state, action) => {
      const { banks } = action.payload;
      state.banks = banks;
    },
    setBanksLoading: (state, action) => {
      const { loading } = action.payload;
      state.banks_loading = loading;
    },
    setCardFormLoading: (state, action) => {
      const { loading } = action.payload;
      state.card_form_loading = loading;
    },
    setBankAccountFormLoading: (state, action) => {
      const { loading } = action.payload;
      state.bank_account_form_loading = loading;
    },
    setBankAccountsLoading: (state, action) => {
      const { loading } = action.payload;
      state.bank_accounts_loading = loading;
    },
    setBankAccount: (state, action) => {
      const { bank_account } = action.payload;
      state.bank_accounts = [...state.bank_accounts, bank_account];
    },
    setBankAccounts: (state, action) => {
      const { bank_accounts } = action.payload;
      state.bank_accounts = bank_accounts;
    },
    setDeleteBankAccountLoading: (state, action) => {
      const { bank_account_id } = action.payload;
      state.delete_bank_account_loading = [...state.delete_bank_account_loading, bank_account_id];
    },
    removeDeleteBankAccountLoading: (state, action) => {
      const { bank_account_id } = action.payload;
      state.delete_bank_account_loading = state.delete_bank_account_loading.filter(
        i => i !== bank_account_id,
      );
    },
    removeBankAccount: (state, action) => {
      const { bank_account_id } = action.payload;
      state.bank_accounts = state.bank_accounts.filter(i => i.id !== bank_account_id);
    },
    setCampaignCredit: (state, action) => {
      const { credit_balance } = action.payload;
      state.credit_balance = credit_balance;
    },
    setWalletID: (state, action) => {
      state.wallet_id = action.payload;
    },
    setWalletEmail: (state, action) => {
      state.wallet_email = action.payload;
    },
  },
});

export const selectBankAccounts = createSelector(
  (state: RootState) => state.payments.bank_accounts,
  bank_accounts => bank_accounts.by_id.map((id: string) => bank_accounts.data[id]),
);

