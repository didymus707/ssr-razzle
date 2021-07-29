import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  banks: [],
  data: {},
  by_id: [],
  meta: {},
  fetch_loading: false,
  create_loading: false,
  update_loading: false,
  delete_loading: false,
};

export const bankAccountsSlice = createSlice({
  name: 'bank_accounts',
  initialState,
  reducers: {
    setBanksData: (state, action) => {
      const banks = action.payload;
      state.banks = banks;
    },
    setBankAccountsData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.data = data;
      state.by_id = by_id;
      state.meta = meta;
    },
    setBankAccountsLoading: (state, action) => {
      const { loading } = action.payload;
      state.fetch_loading = loading;
    },
    setBankAccountsCreateLoading: (state, action) => {
      const { loading } = action.payload;
      state.create_loading = loading;
    },
    setBankAccountsUpdateLoading: (state, action) => {
      const { loading } = action.payload;
      state.update_loading = loading;
    },
    setBankAccountsDeleteLoading: (state, action) => {
      const { loading } = action.payload;
      state.delete_loading = loading;
    },
  },
});
