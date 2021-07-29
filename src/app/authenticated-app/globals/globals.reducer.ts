import { createSlice } from '@reduxjs/toolkit';
import { GlobalsState } from './globals.types';

const initialState = {
  createTableModalIsOpen: false,
  noSubscriptionModalIsOpen: false,
  noSubscriptionModalHeading: '',
  noSubscriptionModalSubHeading: '',
} as GlobalsState;

const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    openCreateTableModal(state) {
      state.createTableModalIsOpen = true;
    },
    closeCreateTableModal(state) {
      state.createTableModalIsOpen = false;
    },
    openNoSubscriptionModal(state, action) {
      const { heading, subHeading } = action.payload;
      state.noSubscriptionModalIsOpen = true;
      state.noSubscriptionModalHeading = heading;
      state.noSubscriptionModalSubHeading = subHeading;
    },
    closeNoSubscriptionModal(state) {
      state.noSubscriptionModalIsOpen = false;
      state.noSubscriptionModalHeading = '';
      state.noSubscriptionModalSubHeading = '';
    },
  },
});

export const {
  openCreateTableModal,
  closeCreateTableModal,
  openNoSubscriptionModal,
  closeNoSubscriptionModal,
} = globalSlice.actions;

export const globalsReducer = globalSlice.reducer;
