import React, { useState } from 'react';
import { Box, Divider, Input } from '@chakra-ui/core/dist';
import { FilterPopover } from './filter-popover';
import { TabNavigator } from 'app/components';

interface Props {
  activeTab: 'all' | 'paid' | 'pending' | 'expired' | 'cancelled';
  setActiveTab: Function;
  searchQuery: string;
  setSearchQuery: Function;
  dateRange: { from: null | string; to: null | string; on: null | string };
  setDateRange: Function;
  onGoToPage: Function;
  disable: boolean;
}

const tabOptions: { label: string; value: string }[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Paid',
    value: 'paid',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];

export const PaymentRequestToolbar = (props: Props) => {
  const [tempSearchQuery, setTempSearchQuery] = useState<string>('');
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    onGoToPage,
  } = props;

  const handleSearchEnterPressed = (e: any) => {
    if (e.key !== 'Enter') return;
    if (tempSearchQuery === searchQuery) return;
    setSearchQuery(tempSearchQuery);
  };

  const handleSearchBlur = () => {
    if (tempSearchQuery === searchQuery) return;
    setSearchQuery(tempSearchQuery);
  };

  const handleDateRangeChange = (values: { from: any; to: any; on: any }) => {
    onGoToPage(1);
    setDateRange({ ...dateRange, ...values });
  };

  return (
    <Box className="section-toolbar">
      <TabNavigator
        options={tabOptions}
        onChange={(value: string) => setActiveTab(value)}
        selectedTab={activeTab}
      />
      <Box display="flex" flexDirection="row" alignItems="center">
        <FilterPopover
          handleDateRangeChange={handleDateRangeChange}
          filterActive={!!dateRange?.from || !!dateRange?.to || !!dateRange?.on}
        />
        <Divider orientation="vertical" marginX="5px" />
        <Input
          className="search-input"
          placeholder="Search requests"
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
