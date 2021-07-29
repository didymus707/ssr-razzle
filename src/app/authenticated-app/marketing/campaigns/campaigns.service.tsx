import { buildGraphURL, buildMarketingReportURL, buildPaymentURL, client } from '../../../../utils';
import {
  CampaignData,
  CampaignTypes,
  MarketingReportSchema,
  MarketingSettingsSchema,
} from './campaigns.types';

export const CAMPAIGN_LIST_LIMIT = 15;
export const CAMPAIGN_SMS_AMOUNT = 2;

export const listCampaigns = (params?: any) => {
  return client('campaign', { params });
};

export const createCampaignItem = (payload: CampaignData) => {
  return client('campaign/create', { method: 'POST', data: payload });
};

export const updateCampaignItem = (payload: CampaignData) => {
  return client('campaign/update', { method: 'PATCH', data: payload });
};

export const fetchCampaignItem = (id: CampaignData['id']) => {
  return client(`campaign/${id}`, { method: 'GET' });
};

export const fetchCampaignReport = (id: CampaignData['id']) => {
  return client(`campaign/report/${id}`, { method: 'GET' });
};

export const updateCampaignAudienceItem = (payload: CampaignData) => {
  return client('campaign/save-audience', { data: payload, method: 'PATCH' });
};

export const updateCampaignContentItem = (payload: CampaignData) => {
  return client('campaign/save-content', { data: payload, method: 'PATCH' });
};

export const updateCampaignBudgetItem = (payload: {
  id: CampaignData['id'];
  budget: CampaignData['budget'];
}) => {
  return client('campaign/save-budget', { data: payload, method: 'PATCH' });
};

export const getCampaignBudgetItem = (id: CampaignData['id']) => {
  return client(`campaign/${id}/budget/`);
};

export const updateCampaignScheduleItem = (payload: CampaignData) => {
  return client('campaign/save-schedule', { data: payload, method: 'PATCH' });
};

export const importBulkItem = (payload: FormData) => {
  return client('campaign/save-bulk', { data: payload, method: 'POST' });
};

export const deleteCampaignItem = (payload: { id: CampaignData['id'] }) => {
  return client('campaign/delete', { data: payload, method: 'DELETE' });
};

export const saveCampaignItemState = (payload: {
  id: CampaignData['id'];
  state: CampaignData['state'];
}) => {
  return client('campaign/save-state', { data: payload, method: 'PATCH' });
};

export const createLinkShortnerItem = (payload: { link: string }) => {
  return client('links/create', { method: 'POST', data: payload });
};

export const searchCampaigns = async ({
  query,
  state,
}: {
  query?: string;
  state?: CampaignTypes;
}) => {
  const response = await client('campaign/search/sms', { params: { query, state } });
  return response.data.campaigns;
};

export const filterCampaigns = ({ query, page }: { query?: string; page?: number }) => {
  return client('campaign/filter/sms', {
    params: { state: query, page, limit: CAMPAIGN_LIST_LIMIT },
  });
};

export const sendTestCampaignMessage = (data: {
  content: string;
  recipients: string;
  sender_id?: string;
}) => {
  return client('campaign/send-test', { data, method: 'POST' });
};

export const getCampaignAudience = async (payload: {
  audience_type: number;
  smart_list_id?: string;
  table_id?: string;
  group_id?: string;
}) => {
  const { data } = await client('campaign/get-audience', { data: payload, method: 'POST' });
  return data;
};

export const topupCampaignCredits = async (payload: { amount: number; card: string }) => {
  const { data } = await client('', {
    data: payload,
    method: 'POST',
    url: buildPaymentURL(`/credits/top-up`),
  });
  return data;
};

export const identityGraphNumberFilter = async (payload: {
  state?: string[];
  lga?: string[];
  gender?: string[];
  predicted_religion?: string[];
  predicted_ethnicity?: string[];
}) => {
  const data = await client('', {
    data: payload,
    method: 'POST',
    url: buildGraphURL(`/filter`),
  });
  return data;
};

export const identityGraphDistinctValues = async (payload: string[]) => {
  return await client('', {
    data: payload,
    method: 'POST',
    url: buildGraphURL(`/distinct_values`),
  });
};

export const identityGraphDependentValues = async (payload: {
  attribute: string;
  dependent: string;
  attribute_values: string[];
}) => {
  return await client('', {
    data: payload,
    method: 'POST',
    url: buildGraphURL(`/dependent_values`),
  });
};

export const getMarketingSettings = async () => {
  const { data } = await client('organisations/settings');
  return data.settings;
};

export const saveMarketingSettings = async (payload: MarketingSettingsSchema) => {
  const { marketing } = payload;
  const { data } = await client('organisations/settings/save', {
    data: { marketing: marketing },
    method: 'PATCH',
  });
  return data;
};

export const generateMarketingReport = async (payload: MarketingReportSchema) => {
  const { data } = await client('', {
    data: payload,
    method: 'POST',
    url: buildMarketingReportURL(`campaigns/request`),
  });
  return data;
};

export const campaignImport = (payload: FormData) => {
  return client('campaign/import', { data: payload, method: 'POST' });
};

export const createCoupon = async (payload: any) => {
  const { data } = await client('campaign/create', { data: payload, method: 'POST' });
  return data;
};

export const filterCoupons = ({ query, page }: { query?: string; page?: number }) => {
  return client('campaign/filter/coupon', {
    params: { state: query, page, limit: CAMPAIGN_LIST_LIMIT },
  });
};

export const searchCoupons = async ({
  query,
  state,
}: {
  query?: string;
  state?: CampaignTypes;
}) => {
  const response = await client('campaign/search/coupon', { params: { query, state } });
  return response.data.campaigns;
};

export const getDashboardData = async (data: { period: number; type?: string }) => {
  const { period, type = 'sms' } = data;
  const response = await client('', {
    data: { period },
    method: 'POST',
    url: buildMarketingReportURL(`campaigns/${type}`),
  });
  return response.data;
};
