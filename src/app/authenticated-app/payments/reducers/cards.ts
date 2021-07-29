import { cardsSlice } from '../slices';

export const {
  setCardsData,
  setCardsDeleteLoading,
  setCardsLoading,
  setCardsUpdateLoading,
} = cardsSlice.actions;

export const cardsReducer = cardsSlice.reducer;
