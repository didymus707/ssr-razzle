import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  by_id: [],
  meta: {},
  fetch_loading: false,
  create_loading: false,
  update_loading: false,
  delete_loading: false,
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCardsData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.data = data;
      state.by_id = by_id;
      state.meta = meta;
    },
    setCardsLoading: (state, action) => {
      const { loading } = action.payload;
      state.fetch_loading = loading;
    },
    setCardsUpdateLoading: (state, action) => {
      const { loading } = action.payload;
      state.update_loading = loading;
    },
    setCardsDeleteLoading: (state, action) => {
      const { loading } = action.payload;
      state.delete_loading = loading;
    },
  },
});
