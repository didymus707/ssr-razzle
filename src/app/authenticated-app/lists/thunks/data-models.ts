import { AppThunk } from 'root';
import { client } from 'utils';
import { fetchSegments, setDataModelsData, setDataModelsLoading } from '../lists.reducer';
import { sendAmplitudeData } from '../../../../utils/amplitude';

export const fetchDataModels = (): AppThunk => async dispatch => {
  try {
    dispatch(setDataModelsLoading(true));
    const response = await client('lists/data_model', {
      method: 'GET',
    });

    const data: { [key: string]: any } = {};
    const by_id: string[] = [];

    response.data.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });

    dispatch(setDataModelsData({ data, by_id, meta: response.meta }));
  } catch (e) {
    dispatch(setDataModelsLoading(false));
    return null;
  }
};

export const createDataModel = (payload: {
  name: string;
  description: string;
  color?: string;
  icon?: string;
  resource: string;
  columns: {
    source: string;
    code: string;
    key: string;
    name: string;
    kind: 'plain' | 'aggregate';
    data_type: string;
  }[];
  relationships: {
    base: string;
    target: string;
  }[];
}): AppThunk => async (dispatch, getState) => {
  sendAmplitudeData('createDataModel');
  const {
    dataModels: { data, meta, by_id },
  } = getState();
  const response = await client(`lists/data_model`, {
    method: 'POST',
    data: payload,
  });

  const updated_data = { ...data, [response.data.id]: response.data };
  const updated_by_id = [...by_id, response.data.id];
  const updated_meta = { ...meta, count_total: meta.count_total + 1 };

  dispatch(
    setDataModelsData({
      data: updated_data,
      by_id: updated_by_id,
      meta: updated_meta,
    }),
  );

  return response.data;
};

export const fetchDataModel = (dataModelID: string): AppThunk => async dispatch => {
  dispatch(setDataModelsLoading(true));
  const response = await client(`lists/data_model/${dataModelID}`, {
    method: 'GET',
  });
  return response.data;
};

export const querySegment = async ({
  page = 1,
  per_page = 10,
  ...data
}: {
  page?: number;
  per_page?: number;
  data_model?: string | null;
  filters?: {
    value: any;
    name?: string;
    column?: string | number;
    channel?: string;
    operator?: string;
    columnID?: string;
    conjunction?: string | null;
  }[];
}) => {
  const payload = { page, per_page, ...data };
  const response = await client(`lists/segment/query/`, {
    data: payload,
    method: 'POST',
  });
  return response.data;
};

export const deleteDataModel = (dataModelID: string): AppThunk => async (dispatch, getState) => {
  const {
    dataModels: { by_id, data, meta },
  } = getState();
  sendAmplitudeData('deleteDataModel');

  const response = await client(`lists/data_model/${dataModelID}`, {
    method: 'DELETE',
  });

  dispatch(fetchSegments());

  const updated_by_id = by_id.filter((i: string) => i !== dataModelID);
  const updated_data = updated_by_id.reduce((acc, i) => ({ ...acc, [i]: data[i] }), {});
  const updated_meta = { ...meta, count_total: meta.count_total - 1 };

  dispatch(setDataModelsData({ data: updated_data, by_id: updated_by_id, meta: updated_meta }));
  return response.data;
};
