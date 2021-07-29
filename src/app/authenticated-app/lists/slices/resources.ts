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

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResourcesData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.data = data;
      state.by_id = by_id;
      state.meta = meta;
    },
    setResourcesLoading: (state, action) => {
      const loading = action.payload;
      state.loading = loading;
    },
  },
});
