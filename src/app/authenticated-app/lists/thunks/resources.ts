import { AppThunk } from '../../../../root';
import { buildAppsURL, client } from '../../../../utils';
import {
  fetchDataModels,
  fetchSegments,
  setResourcesData,
  setResourcesLoading,
} from '../lists.reducer';
import { sendAmplitudeData } from '../../../../utils/amplitude';

export const requestResourceAuth = (
  resourceName: string,
  resourceType: string,
): AppThunk => async () => {
  const response = await client(`lists/resource/${resourceType}/auth/request`, {
    method: 'GET',
    params: {
      name: resourceName,
    },
  });
  return response.data['auth_url'];
};

export const requestAppResourceAuth = (type: string, params: {}): AppThunk => async () => {
  const response = await client('', {
    url: buildAppsURL(`/${type}/auth/request`),
    method: 'GET',
    params,
  });
  return response.data.auth_url;
};

export const submitAppResourceAuth = (
  type: string,
  payload: { username: string; password: string },
  params: { organisation_account_name: string },
): AppThunk => async (dispatch, getState) => {
  sendAmplitudeData('createResource');
  const response = await client('', {
    url: buildAppsURL(`/${type}/auth/request`),
    method: 'POST',
    params,
    data: payload,
  });
  const {
    resources: { data, meta, by_id },
  } = getState();
  const resource = response.data;

  const updated_data = { ...data, [resource.id]: resource };
  const updated_by_id = [...by_id, resource.id];
  const updated_meta = { ...meta, count_total: meta.count_total + 1 };

  dispatch(setResourcesData({ data: updated_data, by_id: updated_by_id, meta: updated_meta }));
  return response.data;
};

export const testResourceConnection = (
  payload: {
    host: string;
    port: string;
    dbname: string;
    username: string;
    password: string;
    string: string;
    ssh: boolean;
    ssh_config?: {
      bastion_host: string;
      bastion_port: string;
      bastion_user: string;
    };
  },
  resourceType: string,
): AppThunk => async () => {
  sendAmplitudeData('testResourceConnection');
  const response = await client(`lists/resource/${resourceType}/auth`, {
    method: 'POST',
    data: payload,
  });
  return response.message;
};

export const createResource = (
  payload: {
    host: string;
    port: string;
    dbname: string;
    username: string;
    password: string;
    string: string;
    ssh: boolean;
    ssh_config?: {
      bastion_host: string;
      bastion_port: string;
      bastion_user: string;
    };
  },
  resourceType: string,
): AppThunk => async (dispatch, getState) => {
  sendAmplitudeData('createResource');
  const {
    resources: { data, meta, by_id },
  } = getState();

  const response = await client(`lists/resource/${resourceType}/`, {
    method: 'POST',
    data: payload,
  });

  const updated_data = { ...data, [response.data.id]: response.data };
  const updated_by_id = [...by_id, response.data.id];
  const updated_meta = { ...meta, count_total: meta.count_total + 1 };

  dispatch(
    setResourcesData({
      data: updated_data,
      by_id: updated_by_id,
      meta: updated_meta,
    }),
  );

  return response.data;
};

export const fetchResources = (): AppThunk => async dispatch => {
  try {
    dispatch(setResourcesLoading(true));
    const response = await client('lists/resource/', {
      method: 'GET',
    });

    const data: { [key: string]: any } = {};
    const by_id: string[] = [];

    response.data.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });

    dispatch(setResourcesData({ data, by_id, meta: {} }));
    dispatch(setResourcesLoading(false));
  } catch (e) {
    dispatch(setResourcesLoading(false));

    return null;
  }
};

export const updateResource = (resourceID: string, payload: {}): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateResource');
  const {
    resources: { by_id, data, meta },
  } = getState();

  const response = await client(`lists/resource/${resourceID}`, {
    method: 'PATCH',
    data: payload,
  });

  const updated_data = { ...data, [resourceID]: response.data };

  dispatch(setResourcesData({ data: updated_data, by_id, meta }));

  return response.data;
};

export const deleteResource = (resourceID: string): AppThunk => async (dispatch, getState) => {
  const {
    resources: { by_id, data, meta },
  } = getState();
  sendAmplitudeData('deleteResource');

  const response = await client(`lists/resource/${resourceID}`, {
    method: 'DELETE',
  });

  dispatch(fetchDataModels());
  dispatch(fetchSegments());

  const updated_by_id = by_id.filter((i: string) => i !== resourceID);
  const updated_data = updated_by_id.reduce((acc, i) => ({ ...acc, [i]: data[i] }), {});
  const updated_meta = { ...meta, count_total: meta.count_total - 1 };

  dispatch(setResourcesData({ data: updated_data, by_id: updated_by_id, meta: updated_meta }));

  return response.data;
};

export const fetchResourceSchema = (resourceID: string): AppThunk => async (dispatch, getState) => {
  const {
    resources: { data },
  } = getState();

  // @ts-ignore
  const resource = data[resourceID];

  const response = await client(`lists/resource/${resource?.provider}/schema/${resourceID}`, {
    method: 'GET',
  });
  return response.data;
};

export const fetchAppEndpoints = (type: string): AppThunk => async () => {
  const response = await client('', {
    url: buildAppsURL(`/${type}/endpoints`),
    method: 'GET',
  });
  return response['data'];
};

export const fetchAppEndpointSchema = (type: string, endpointID: string): AppThunk => async () => {
  const response = await client('', {
    url: buildAppsURL(`/${type}/endpoints/${endpointID}`),
    method: 'GET',
  });
  return response['data']['schema'];
};

export const enableResourceWebhook = (resourceID: string, type: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    resources: { by_id, data, meta },
  } = getState();
  const response = await client('', {
    url: buildAppsURL(`/${type}/webhooks`),
    method: 'POST',
    data: {
      resource: resourceID,
    },
  });

  // @ts-ignore
  const updatedData = { ...data, [resourceID]: { ...data[resourceID], webhooks_enabled: true } };
  dispatch(setResourcesData({ data: updatedData, by_id, meta }));
  return response.data;
};

export const disableResourceWebhook = (resourceID: string, type: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    resources: { by_id, data, meta },
  } = getState();
  const response = await client('', {
    url: buildAppsURL(`/${type}/webhooks/${resourceID}`),
    method: 'DELETE',
  });
  // @ts-ignore
  const updated_data = { ...data, [resourceID]: { ...data[resourceID], webhooks_enabled: false } };
  dispatch(setResourcesData({ data: updated_data, by_id, meta }));
  return response.data;
};
