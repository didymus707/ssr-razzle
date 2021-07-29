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
  data: {},
  by_id: [],
  meta: initial_meta,
  loading: false,
};

export const paymentRequestsSlice = createSlice({
  name: 'payment_links',
  initialState,
  reducers: {
    setPaymentRequestsData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.data = data;
      state.by_id = by_id;
      state.meta = meta;
    },
    setPaymentRequestsLoading: (state, action) => {
      const { loading } = action.payload;
      state.loading = loading;
    },
  },
});
