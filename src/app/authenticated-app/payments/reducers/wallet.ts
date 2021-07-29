import { walletSlice } from '../slices';

export const { setWalletData, setWalletLoading, setDefaultCard } = walletSlice.actions;

export const walletReducer = walletSlice.reducer;
