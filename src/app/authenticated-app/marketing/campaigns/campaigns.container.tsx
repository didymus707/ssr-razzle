import React from 'react';
import { connect } from 'react-redux';
import { CampaignsComponent } from './campaigns.component';
import { campaignsSearchResults } from './campaigns.reducer';
import { CampaignContainerProps } from './campaigns.types';

export const campaignStateConnector = connect(null, {
  campaignsSearchResults,
});

function CampaignsContainer(props: CampaignContainerProps) {
  return <CampaignsComponent {...props} />;
}

export const Campaigns = campaignStateConnector(CampaignsContainer);
