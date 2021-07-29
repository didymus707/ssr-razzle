import { buildPaymentURL, client } from '../../../../utils';
import {
  setCardsData,
  setCardsLoading,
  setCardsUpdateLoading,
  setCardsDeleteLoading,
} from '../reducers';
import { AppThunk } from '../../../../root';
import { Card } from '../payments.types';

export const fetchCards = (): AppThunk => async dispatch => {
  dispatch(setCardsLoading({ loading: true }));
  try {
    const response = await client('', {
      url: buildPaymentURL(`/card/`),
      method: 'GET',
    });

    const { meta } = response;
    const data: { [key: string]: Card } = {};
    const by_id: string[] = [];

    response.data.forEach((i: Card) => {
      data[i.id] = i;
      by_id.push(i.id);
    });

    dispatch(setCardsData({ data, by_id, meta }));
    dispatch(setCardsLoading({ loading: false }));
  } catch (e) {
    dispatch(setCardsLoading({ loading: false }));
    return null;
  }
};
