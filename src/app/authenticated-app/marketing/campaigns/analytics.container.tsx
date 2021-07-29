import React from 'react';
import { connect } from 'react-redux';
import { CampaginAnalyticsUI } from './analytics.ui';
import { CampaignAnalyticsProps } from './analytics.types';
import { RootState } from '../../../../root';
import { fetchCampaign } from './campaigns.reducer';

function mapStateToProps(state: RootState) {
  return {
    campaign: state.campaigns.campaign,
  };
}

export const campaignAnalyticsConnector = connect(mapStateToProps, {
  fetchCampaign,
});

const CampaignAnalyticsContainer = (props: CampaignAnalyticsProps) => {
  return <CampaginAnalyticsUI {...props} />;
};

export const CampaignAnalytics = campaignAnalyticsConnector(CampaignAnalyticsContainer);
