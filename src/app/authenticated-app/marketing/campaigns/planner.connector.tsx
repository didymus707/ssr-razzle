import { connect } from 'react-redux';
import { RootState } from '../../../../root';
import {
  addCampaign,
  fetchCampaign,
  updateCampaign,
  importBulkUpload,
  saveCampaignDraft,
  fetchCampaignBudget,
  updateCampaignBudget,
  updateCampaignContent,
  updateCampaignSchedule,
  updateCampaignAudience,
  updateCampaignItemState,
  fetchStates,
  fetchGenders,
  fetchEthnicGroups,
  fetchReligions,
} from './campaigns.reducer';
import {
  fetchTemplate,
  fetchTemplates,
  fetchSampleTemplates,
  editTemplate,
} from '../templates/templates.reducers';
import { addAudience } from '../../lists/lists.thunks';
import { fetchWallet } from '../../payments';

function mapStateToProps(state: RootState) {
  return {
    ...state.lists,
    ...state.templates,
    ...state.campaigns,
    user: state.auth.user,
    profile: state.auth.profile,
    organisations: state.auth.organisations,
    credit_balance: state.payments.wallet.data.credit_balance,
  };
}

export const plannerConnector = connect(mapStateToProps, {
  addCampaign,
  fetchCampaign,
  updateCampaign,
  fetchTemplate,
  fetchTemplates,
  importBulkUpload,
  saveCampaignDraft,
  fetchCampaignBudget,
  fetchSampleTemplates,
  updateCampaignBudget,
  updateCampaignContent,
  updateCampaignAudience,
  updateCampaignSchedule,
  updateCampaignItemState,
  addAudience,
  editTemplate,
  fetchWallet,
  fetchStates,
  fetchGenders,
  fetchEthnicGroups,
  fetchReligions,
});
