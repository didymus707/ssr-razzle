import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CampaignState, CampaignData, CampaignTypes } from './campaigns.types';
import { AppDispatch, AppThunk } from '../../../../root/root.types';
import {
  listCampaigns,
  importBulkItem,
  searchCampaigns,
  fetchCampaignItem,
  updateCampaignItem,
  createCampaignItem,
  deleteCampaignItem,
  getCampaignBudgetItem,
  saveCampaignItemState,
  updateCampaignContentItem,
  updateCampaignBudgetItem,
  updateCampaignScheduleItem,
  updateCampaignAudienceItem,
  fetchCampaignReport,
  filterCampaigns,
  identityGraphDistinctValues,
} from './campaigns.service';
import { sortCampaignsFunc } from './campaigns.utils';

const initialState: CampaignState = {
  budget: 0,
  campaign: {},
  total_count: 0,
  allCampaigns: [],
  campaignsList: [],
  importedData: null,
  audience: { count: 0 },
  states: [],
  genders: [],
  ethnicGroups: [],
  religions: [],
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: initialState,
  reducers: {
    getAllCampaigns(state, action: PayloadAction<{ campaigns: CampaignData[] }>) {
      const { campaigns } = action.payload;
      state.allCampaigns = campaigns;
    },
    getCampaigns(
      state,
      action: PayloadAction<{ campaigns: CampaignData[]; total_count?: number }>,
    ) {
      const { campaigns, total_count } = action.payload;
      state.campaignsList = campaigns;
      state.total_count = total_count ? total_count : 0;
    },
    getCampaign(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      state.campaign = campaign;
    },
    createCampaign(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      state.campaign = campaign;
      state.campaignsList.unshift(campaign);
    },
    editCampaign(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      const campaignId = state.campaignsList?.findIndex(item => item.id === campaign.id);
      state.campaign = campaign;
      state.campaignsList[campaignId] = campaign;
    },
    editCampaignAudience(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      const campaignId = state.campaignsList?.findIndex(item => item.id === campaign.id);
      state.campaign = campaign;
      state.campaignsList[campaignId] = campaign;
    },
    editCampaignBudget(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      const campaignId = state.campaignsList?.findIndex(item => item.id === campaign.id);
      state.campaign = campaign;
      state.campaignsList[campaignId] = campaign;
    },
    getCampaignBudget(
      state,
      action: PayloadAction<{
        budget: number;
        campaign: CampaignData;
      }>,
    ) {
      const { campaign, budget } = action.payload;
      const campaignId = state.campaignsList.findIndex(item => item.id === campaign.id);
      if (!campaign.budget) {
        campaign.budget = budget;
      }
      state.budget = budget;
      state.campaign = campaign;
      state.campaignsList[campaignId] = campaign;
    },
    editCampaignSchedule(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      const campaignId = state.campaignsList?.findIndex(item => item.id === campaign.id);
      const campaignPayload = { ...campaign, budget: state.budget };
      state.campaign = campaignPayload;
      state.campaignsList[campaignId] = campaignPayload;
    },
    editCampaignContent(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      const campaignId = state.campaignsList?.findIndex(item => item.id === campaign.id);
      const campaignPayload = { ...campaign, budget: state.budget };
      state.campaign = campaignPayload;
      state.campaignsList[campaignId] = campaignPayload;
    },
    saveCampaignState(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      const campaignId = state.campaignsList?.findIndex(item => item.id === campaign.id);
      const campaignPayload = { ...campaign, budget: state.budget };
      state.campaign = campaignPayload;
      state.campaignsList[campaignId] = campaignPayload;
    },
    importCampaignBulk(state, action: PayloadAction<{ campaign: CampaignData }>) {
      const { campaign } = action.payload;
      state.campaign = campaign;
    },
    deleteCampaign(state, action: PayloadAction<{ id: CampaignData['id'] }>) {
      const { id } = action.payload;
      state.campaignsList = state.campaignsList?.filter(item => item.id !== id);
    },
    getStates(state, action: PayloadAction<{ states: string[] }>) {
      const { states } = action.payload;
      state.states = states;
    },
    getGenders(state, action: PayloadAction<{ genders: string[] }>) {
      const { genders } = action.payload;
      state.genders = genders;
    },
    getReligions(state, action: PayloadAction<{ religions: string[] }>) {
      const { religions } = action.payload;
      state.religions = religions;
    },
    getEthnicGroups(state, action: PayloadAction<{ ethnicGroups: string[] }>) {
      const { ethnicGroups } = action.payload;
      state.ethnicGroups = ethnicGroups;
    },
  },
});

export const {
  getCampaign,
  editCampaign,
  getCampaigns,
  deleteCampaign,
  createCampaign,
  getAllCampaigns,
  getCampaignBudget,
  saveCampaignState,
  importCampaignBulk,
  editCampaignBudget,
  editCampaignContent,
  editCampaignSchedule,
  editCampaignAudience,
  getStates,
  getGenders,
  getReligions,
  getEthnicGroups,
} = campaignsSlice.actions;

export const campaignReducer = campaignsSlice.reducer;

//////////////////////////////////////////////////////
// Campaign Thunks

export const fetchCampaigns = (params?: any): AppThunk => async dispatch => {
  const response = await listCampaigns(params);
  const { campaigns } = response.data;
  /**
   * sort campaigns based on created datetime
   * this sort should come from API actually
   */
  const sortedCampaigns = campaigns.sort(sortCampaignsFunc).map((item: any) => ({
    ...item,
  }));
  dispatch(getAllCampaigns({ campaigns: sortedCampaigns }));
  return response.data;
};

export const fetchCampaign = (id: CampaignData['id'], populateReport: boolean = false) => async (
  dispatch: AppDispatch,
) => {
  const response = await fetchCampaignItem(id);
  let reports = undefined;
  let campaignWithReportData = undefined;
  if (populateReport) {
    const reportResponse = await fetchCampaignReport(id);
    ({ reports, campaign: campaignWithReportData } = reportResponse.data);
  }
  const { campaign } = response.data;
  const count = campaign.audience_type === 2 ? campaign?.audience?.count : campaign.count;
  dispatch(
    getCampaign({
      campaign: {
        ...campaign,
        count,
        reports,
        ...campaignWithReportData,
      },
    }),
  );
  return response.data;
};

export const addCampaign = (payload: CampaignData) => async (dispatch: AppDispatch) => {
  const response = await createCampaignItem(payload);
  const { campaign } = response.data;
  dispatch(createCampaign({ campaign }));
  return response.data;
};

export const saveCampaignDraft = (payload: CampaignData) => async (dispatch: AppDispatch) => {
  const response = await createCampaignItem({ ...payload, state: 'draft' });
  const { campaign } = response.data;
  dispatch(createCampaign({ campaign }));
  return response.data;
};

export const updateCampaign = (payload: CampaignData) => async (dispatch: AppDispatch) => {
  const response = await updateCampaignItem(payload);
  const { campaign } = response.data;
  dispatch(editCampaign({ campaign }));
  return response.data;
};

export const updateCampaignSchedule = (payload: CampaignData) => async (dispatch: AppDispatch) => {
  const response = await updateCampaignScheduleItem(payload);
  const { campaign } = response.data;
  dispatch(editCampaignSchedule({ campaign }));
  return response.data;
};

export const updateCampaignContent = (payload: CampaignData) => async (dispatch: AppDispatch) => {
  const response = await updateCampaignContentItem(payload);
  const { campaign } = response.data;
  dispatch(editCampaignContent({ campaign }));
  return response.data;
};

export const updateCampaignAudience = (payload: CampaignData) => async (dispatch: AppDispatch) => {
  const response = await updateCampaignAudienceItem(payload);
  const { campaign } = response.data;
  dispatch(editCampaignAudience({ campaign }));
  return response.data;
};

export const fetchCampaignBudget = (id: CampaignData['id']) => async (dispatch: AppDispatch) => {
  const response = await getCampaignBudgetItem(id);
  const { campaign, budget } = response.data;
  dispatch(getCampaignBudget({ campaign, budget }));
  return response.data;
};

export const updateCampaignBudget = (payload: {
  id: CampaignData['id'];
  budget: CampaignData['budget'];
}) => async (dispatch: AppDispatch) => {
  const response = await updateCampaignBudgetItem(payload);
  const { campaign } = response.data;
  dispatch(editCampaignBudget({ campaign }));
  return response.data;
};

export const importBulkUpload = (payload: any) => async (dispatch: AppDispatch) => {
  const response = await importBulkItem(payload);
  const { campaign } = response.data;
  dispatch(importCampaignBulk({ campaign }));
  return response.data;
};

export const updateCampaignItemState = (payload: {
  id: CampaignData['id'];
  state: CampaignData['state'];
}) => async (dispatch: AppDispatch) => {
  const response = await saveCampaignItemState(payload);
  const { campaign } = response.data;
  dispatch(saveCampaignState({ campaign }));
  return response.data;
};

export const removeCampaign = (payload: { id: CampaignData['id'] }) => async (
  dispatch: AppDispatch,
) => {
  const response = await deleteCampaignItem(payload);
  dispatch(deleteCampaign(payload));
  return response;
};

export const campaignsSearchResults = ({
  query,
  state,
}: {
  query?: string;
  state?: CampaignTypes;
}): AppThunk => async dispatch => {
  const response = await searchCampaigns({ query, state });
  const { campaigns } = response.data;
  const sortedCampaigns = campaigns.sort(sortCampaignsFunc).map((item: any) => ({
    ...item,
  }));
  dispatch(getCampaigns({ campaigns: sortedCampaigns }));
  return response.data;
};

export const campaignsFilterResults = ({
  query,
  page,
}: {
  query?: string;
  page?: number;
}): AppThunk => async dispatch => {
  const response = await filterCampaigns({ query, page });
  const { campaigns, total_count } = response.data;
  const sortedCampaigns = campaigns.sort(sortCampaignsFunc).map((item: any) => ({
    ...item,
  }));
  dispatch(getCampaigns({ campaigns: sortedCampaigns, total_count }));
  return response.data;
};

export const fetchStates = () => async (dispatch: AppDispatch) => {
  const response = await identityGraphDistinctValues(['state']);
  dispatch(getStates({ states: response }));
  return response;
};

export const fetchGenders = () => async (dispatch: AppDispatch) => {
  const response = await identityGraphDistinctValues(['gender']);
  dispatch(getGenders({ genders: response }));
  return response;
};

export const fetchReligions = () => async (dispatch: AppDispatch) => {
  const response = await identityGraphDistinctValues(['predicted_religion']);
  dispatch(getReligions({ religions: response }));
  return response;
};

export const fetchEthnicGroups = () => async (dispatch: AppDispatch) => {
  const response = await identityGraphDistinctValues(['predicted_ethnicity']);
  dispatch(getEthnicGroups({ ethnicGroups: response }));
  return response;
};
