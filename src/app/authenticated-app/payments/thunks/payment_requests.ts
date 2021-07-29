import { buildPaymentURL, client } from '../../../../utils';
import { setPaymentRequestsData, setPaymentRequestsLoading } from '../reducers';
import { AppThunk } from '../../../../root';
import { Meta, PaymentRequest } from '../payments.types';
import { sendAmplitudeData } from '../../../../utils/amplitude';

const initial_meta: Meta = {
  page: 0,
  per_page: 10,
  count_total: 0,
  page_total: 1,
  prev_page: false,
  next_page: true,
};

export const fetchPaymentRequests = (
  page = 1,
  status = 'all',
  search_query = '',
  date_range = { from: null, to: null, on: null },
): AppThunk => async dispatch => {
  dispatch(setPaymentRequestsLoading({ loading: true }));
  dispatch(resetPaymentRequestsData());

  try {
    const params: { [key: string]: any } = {
      page,
      per_page: 15,
      query: search_query,
      status,
    };

    if (date_range['from']) params['date_from'] = date_range['from'];
    if (date_range['to']) params['date_to'] = date_range['to'];
    if (date_range['on']) params['date_on'] = date_range['on'];

    const response = await client('', {
      url: buildPaymentURL(`/payment_request/`),
      method: 'GET',
      params,
    });

    const { meta } = response;
    const data: { [key: string]: PaymentRequest } = {};
    const by_id: string[] = [];

    response.data.forEach((i: PaymentRequest) => {
      data[i.id] = i;
      if (!by_id.includes(i.id)) by_id.push(i.id);
    });

    dispatch(setPaymentRequestsData({ data, by_id, meta }));
    dispatch(setPaymentRequestsLoading({ loading: false }));
    return response['data'];
  } catch (e) {
    dispatch(setPaymentRequestsLoading({ loading: false }));
    return null;
  }
};

export const cancelPaymentRequest = (request_id: string, notify = false): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('cancelPaymentRequest');
  const {
    payments: {
      payment_requests: { data, by_id, meta },
    },
  } = getState();

  try {
    const response = await client('', {
      url: buildPaymentURL(`/payment_request/${request_id}`),
      method: 'DELETE',
      params: {
        notify,
      },
    });
    // @ts-ignore
    const updated_data = { ...data, [request_id]: { ...data[request_id], ...response['data'] } };
    dispatch(setPaymentRequestsData({ data: updated_data, by_id, meta }));
    return response['data'];
  } catch (e) {
    return null;
  }
};

export const markPaymentRequestPaid = (request_id: string): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('markPaymentRequestPaid');
  const {
    payments: {
      payment_requests: { data, by_id, meta },
    },
  } = getState();

  try {
    const response = await client('', {
      url: buildPaymentURL(`/payment_request/${request_id}`),
      method: 'PUT',
    });
    // @ts-ignore
    const updated_data = { ...data, [request_id]: { ...data[request_id], ...response['data'] } };
    dispatch(setPaymentRequestsData({ data: updated_data, by_id, meta }));
    return response['data'];
  } catch (e) {
    return null;
  }
};

export const resetPaymentRequestsData = (): AppThunk => async dispatch => {
  dispatch(
    setPaymentRequestsData({
      data: {},
      by_id: [],
      meta: initial_meta,
    }),
  );
};
