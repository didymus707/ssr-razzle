import { AppThunk } from 'root';
import { client } from 'utils';
import { setDataModelsData, setSegmentsData, setSegmentsLoading } from '../lists.reducer';
import { sendAmplitudeData } from '../../../../utils/amplitude';

export const fetchSegments = (): AppThunk => async dispatch => {
  try {
    dispatch(setSegmentsLoading(true));
    const response = await client('lists/segment', {
      method: 'GET',
    });

    const data: { [key: string]: any } = {};
    const by_id: string[] = [];

    response.data.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });

    dispatch(setSegmentsData({ data, by_id, meta: response.meta }));
  } catch (e) {
    dispatch(setSegmentsLoading(false));
    return null;
  }
};

export const createSegment = (payload: {
  name: string;
  description: string;
  color?: string;
  icon?: string;
  data_model: string;
  filters: {
    column: string;
    operator: string;
    sub_operator: string;
    value: string;
    conjunction: 'and' | 'or';
  }[];
}): AppThunk => async (dispatch, getState) => {
  sendAmplitudeData('createSegment');
  const {
    segments: { data, meta, by_id },
  } = getState();

  const response = await client(`lists/segment`, {
    method: 'POST',
    data: payload,
  });

  const updated_data = { ...data, [response.data.id]: response.data };
  const updated_by_id = [...by_id, response.data.id];
  const updated_meta = { ...meta, count_total: meta.count_total + 1 };

  dispatch(
    setSegmentsData({
      data: updated_data,
      by_id: updated_by_id,
      meta: updated_meta,
    }),
  );

  return response.data;
};

export const deleteSegment = (segmentID: string): AppThunk => async (dispatch, getState) => {
  const {
    segments: { by_id, data, meta },
  } = getState();
  sendAmplitudeData('deleteSegment');

  const response = await client(`lists/segment/${segmentID}`, {
    method: 'DELETE',
  });

  const updated_by_id = by_id.filter((i: string) => i !== segmentID);
  const updated_data = updated_by_id.reduce((acc, i) => ({ ...acc, [i]: data[i] }), {});
  const updated_meta = { ...meta, count_total: meta.count_total - 1 };

  setSegmentsData(
    setDataModelsData({ data: updated_data, by_id: updated_by_id, meta: updated_meta }),
  );
  return response.data;
};
