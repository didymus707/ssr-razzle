import { Icon } from '@chakra-ui/core';
import React from 'react';
import { Search } from '../../../../components';
import { CampaignTypes } from '../campaigns.types';
import { CreditTopupCard } from './credit-topup-card';

type Props = {
  selectedTab: CampaignTypes;
  onSearch(value: string): void;
  selectTab(value: CampaignTypes): void;
};

export const CampaignSidebar = (props: Props) => {
  const { selectTab, selectedTab, onSearch } = props;

  return (
    <div className="side-bar">
      <div className="search-section">
        <Search
          width="100%"
          onChange={onSearch}
          placeholder="Search"
          marginBottom={['0.5rem', 0, 0, 0]}
        />
      </div>
      <div
        className={`option-item ${selectedTab === undefined && 'active'}`}
        onClick={() => selectTab(undefined)}
      >
        <Icon name="campaign-all" size="14px" marginRight="10px" />
        <div className="text">All</div>
      </div>
      <div
        className={`option-item ${selectedTab === 'scheduled' && 'active'}`}
        onClick={() => selectTab('scheduled')}
      >
        <Icon name="campaign-scheduled" size="14px" marginRight="10px" />
        <div className="text">Scheduled</div>
      </div>
      <div
        className={`option-item ${selectedTab === 'sent' && 'active'}`}
        onClick={() => selectTab('sent')}
      >
        <Icon name="campaign-sent" size="14px" marginRight="10px" />
        <div className="text">Sent</div>
      </div>
      <div
        className={`option-item ${selectedTab === 'draft' && 'active'}`}
        onClick={() => selectTab('draft')}
      >
        <Icon name="campaign-draft" size="14px" marginRight="10px" />
        <div className="text">Draft</div>
      </div>
      <CreditTopupCard content="This is the credit you have for sending out campaign messages" />
    </div>
  );
};
