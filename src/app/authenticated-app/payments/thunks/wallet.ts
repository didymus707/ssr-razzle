import { buildPaymentURL, client } from '../../../../utils';
import { setWalletData, setWalletLoading } from '../reducers';
import { AppThunk } from '../../../../root';
import { fetchManagedAccount } from './managed_account';

export const fetchWallet = (organization_id: string): AppThunk => async dispatch => {
  dispatch(setWalletLoading({ loading: true }));
  try {
    const response = await client('', {
      url: buildPaymentURL(`/wallet/${organization_id}`),
      method: 'GET',
    });

    if (response.data.managed_bank_account_id) dispatch(fetchManagedAccount());
    dispatch(setWalletData(response.data));
    dispatch(setWalletLoading({ loading: false }));
    return response.data;
  } catch (e) {
    dispatch(setWalletLoading({ loading: false }));
    return null;
  }
};
