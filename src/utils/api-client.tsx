import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { loadState } from './localstorage';

export const buildConversationUrl = (url: string) =>
  `${process.env.REACT_APP_CONVERSATION_API_URL}/api/v1/${url}`;

export const buildPaymentURL = (url: string) => `${process.env.REACT_APP_PAYMENT_API_URL}${url}`;
export const buildAppsURL = (url: string) => `${process.env.REACT_APP_APPS_API_URL}${url}`;
export const buildGraphURL = (url: string) => `${process.env.REACT_APP_GRAPH_API_URL}${url}`;
export const buildMarketingReportURL = (url: string) =>
  `${process.env.REACT_APP_MARKETING_REPORT_API_URL}${url}`;

export async function client(
  url: string,
  { data, method = 'GET', ...customConfig }: AxiosRequestConfig = {},
  tokenProtected = true,
) {
  const localData = loadState();
  const headers = { 'content-type': 'application/json' } as {
    'content-type': string;
    Authorization: string;
    organisationID: string;
  };
  const token = localData && localData.token;
  const { organisations, profile } = localData || { organisations: null, profile: null };
  if (token && tokenProtected) {
    headers.Authorization = token;
  }
  if (profile || organisations) {
    // if no profile, use the organisationID of the last organization
    headers.organisationID = profile
      ? profile.organisation_id
      : organisations[organisations.length - 1].id;
  }
  const config = {
    headers,
    method,
    data,
    url: `${process.env.REACT_APP_API_URL}/${url}`,
    ...customConfig,
  } as AxiosRequestConfig;

  try {
    const result = await Axios(config);
    const { data } = result;
    return data;
  } catch (error) {
    throw error;
  }
}

Axios.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  function (error: AxiosError) {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    if (error.response && error.response.data) {
      if (error.response.data.conversationErrorPayload) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error.response.data.message);
    }
    return Promise.reject(error.message);
  },
);
