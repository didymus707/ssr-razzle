import { createSlice } from '@reduxjs/toolkit';
import { Meta } from '../payments.types';

const initial_meta: Meta = {
  page: 0,
  per_page: 8,
  count_total: 0,
  page_total: 1,
  prev_page: false,
  next_page: true,
};

const initialState = {
  account: {
    data: null,
    loading: false,
  },
  transactions: {
    data: {},
    by_id: [],
    meta: initial_meta,
    loading: false,
  },
};

export const managedAccountSlice = createSlice({
  name: 'managed_account',
  initialState,
  reducers: {
    setManagedAccountData: (state, action) => {
      const { data } = action.payload;
      state.account.data = data;
    },
    setManagedAccountLoading: (state, action) => {
      const loading = action.payload;
      state.account.loading = loading;
    },
    setManagedAccountTransactionsLoading: (state, action) => {
      const loading = action.payload;
      state.transactions.loading = loading;
    },
    setManagedAccountTransactionsData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.transactions.data = data;
      state.transactions.by_id = by_id;
      state.transactions.meta = meta;
    },
  },
});
