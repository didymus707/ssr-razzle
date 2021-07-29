import { Box, Input } from '@chakra-ui/core';
import React, { useState } from 'react';
import { TabNavigator } from 'app/components';

interface Props {
  activeTab: 'all' | 'credit' | 'debit';
  setActiveTab: Function;
  searchQuery: string;
  setSearchQuery: Function;
  dateRange: { from: null | string; to: null | string };
  setDateRange: Function;
  disable: boolean;
}

const tabOptions: { label: string; value: string }[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Credit',
    value: 'credit',
  },
  {
    label: 'Debit',
    value: 'debit',
  },
];

export const TransactionHistoryToolbar = (props: Props) => {
  const [tempSearchQuery, setTempSearchQuery] = useState<string>('');
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = props;

  const handleSearchEnterPressed = (e: any) => {
    if (e.key !== 'Enter') return;
    if (tempSearchQuery === searchQuery) return;
    setSearchQuery(tempSearchQuery);
  };

  const handleSearchBlur = () => {
    if (tempSearchQuery === searchQuery) return;
    setSearchQuery(tempSearchQuery);
  };

  return (
    <Box className="section-toolbar">
      <TabNavigator
        options={tabOptions}
        onChange={(value: string) => setActiveTab(value)}
        selectedTab={activeTab}
      />

      <Box display="flex" flexDirection="row" alignItems="center">
        {/*  <Button variant="ghost" color="#4f4f4f" size="xs" leftIcon="external-link">*/}
        {/*    Export*/}
        {/*  </Button>*/}
        {/*  <Divider orientation="vertical" marginX="5px" />*/}
        <Input
          className="search-input"
          placeholder="Search transactions"
          size="sm"
          value={tempSearchQuery}
          onChange={(event: any) => setTempSearchQuery(event.target.value)}
          onKeyPress={handleSearchEnterPressed}
          onBlur={handleSearchBlur}
        />
      </Box>
    </Box>
  );
};
