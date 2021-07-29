import { createContext } from 'hooks';
import React, { ReactNode, useState } from 'react';
import { CampaignTypes } from './campaigns/campaigns.types';

export const [Provider, useMarketing] = createContext<{
  page: number;
  activeTab: CampaignTypes;
  handleSetPage(page: number): void;
  handleSetActiveTab(tab: CampaignTypes): void;
}>();

export const MarketingProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<CampaignTypes>();

  const handleSetPage = (page: number) => {
    setPage(page);
  };

  const handleSetActiveTab = (tab: CampaignTypes) => {
    setActiveTab(tab);
  };

  return (
    <Provider value={{ page, activeTab, handleSetPage, handleSetActiveTab }}>{children}</Provider>
  );
};
