import { createSlice } from '@reduxjs/toolkit';

const initialMeta = {
  count_total: 0,
  page: 1,
  per_page: 20,
  next_page: true,
  prev_page: false,
};

const initialState = {
  data: {},
  by_id: [],
  meta: initialMeta,
  loading: false,
};

export const segmentsSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    setSegmentsData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.data = data;
      state.by_id = by_id;
      state.meta = meta;
    },
    setSegmentsLoading: (state, action) => {
      const loading = action.payload;
      state.loading = loading;
    },
  },
});
