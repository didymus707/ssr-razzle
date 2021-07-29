import { createSlice } from '@reduxjs/toolkit';

const initialSlice = {
  data: {
    id: null,
    organizationID: null,
    managed_bank_account_id: null,
    payment_setup_id: null,
    payment_setup_status: 'pristine',
    email: null,
    customer_code_stripe: null,
    customer_code_paystack: null,
    credit_balance: 0,
    card_default: null,
  },
  loading: false,
  update_loading: false,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: initialSlice,
  reducers: {
    setWalletData: (state, action) => {
      const data = action.payload;
      state.data = {
        ...state.data,
        ...data,
      };
    },
    setWalletLoading: (state, action) => {
      const { loading } = action.payload;
      state.loading = loading;
    },
    setDefaultCard: (state, action) => {
      const card_id = action.payload;
      state.data.card_default = card_id;
    },
  },
});
