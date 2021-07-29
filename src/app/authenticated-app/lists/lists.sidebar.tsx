import React, { ChangeEvent } from 'react';
import { Heading, Icon, Input, Stack, Text } from '@chakra-ui/core';
import { Box } from '@chakra-ui/core/dist';
import { useHistory } from 'react-router-dom';
import { Button } from 'app/components';
import { useSelector } from 'react-redux';
import { selectActiveSubscription } from '../settings';
import Cookie from 'js-cookie';

type Props = {
  searchValue: string;
  setSearchValue: Function;
  visualization: string;
  setVisualization: Function;
  selectTab: Function;
  selectedTab: string;
  totalLists: number;
};

const tab_options = [
  { key: 'all', label: 'All', icon: 'grid2', color: '' },
  { key: 'lists', label: 'Lists', icon: 'grid2', color: '' },
  { key: 'smart', label: 'Smart Lists', icon: 'grid2', color: '' },
  { key: 'favorites', label: 'Favorites', icon: 'star', color: 'rgba(233,168,0,0.8)' },
  { key: 'trash', label: 'Trash', icon: 'trash', color: 'rgba(235,87,87,1)' },
  { key: 'resources', label: 'Resources', icon: 'blocks', color: '' },
];

export const ListSidebar = (props: Props) => {
  const {
    searchValue,
    setSearchValue,
    visualization,
    setVisualization,
    selectedTab,
    totalLists,
  } = props;

  const router_history = useHistory();
  const active_subscription: any = useSelector(selectActiveSubscription);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="side-bar">
      <div className="search-section">
        <Input
          value={searchValue}
          variant="filled"
          className="search-input"
          placeholder="Search lists"
          onChange={handleSearchInputChange}
        />
        <div className="action-section">
          <div
            className={`btn-bg ${visualization === 'grid' && 'active'}`}
            onClick={() => {
              setVisualization('grid');
              Cookie.set('lists_visualization', 'grid');
            }}
          >
            <Icon size="11px" name="grid3" />
          </div>
          <div
            className={`btn-bg ${visualization === 'list' && 'active'}`}
            onClick={() => {
              setVisualization('list');
              Cookie.set('lists_visualization', 'list');
            }}
          >
            <Icon size="12px" name="hamburger" />
          </div>
        </div>
      </div>
      <div>
        {tab_options.map((i: any, index: any) => (
          <div
            key={index}
            className={`option-item ${selectedTab === i.key && 'active'}`}
            onClick={() => props.selectTab(i.key)}
          >
            <Icon name={i.icon} size="12px" marginRight="10px" color={i.color} />
            <div className="text">{i.label}</div>
          </div>
        ))}
      </div>

      <Box p="0.75rem 1rem" bg="#e8f7ff" rounded="5px">
        <Stack pb="0.5rem">
          <Heading fontSize="0.875rem" size="sm" fontWeight={500}>
            Lists Created: {totalLists}
            {active_subscription?.details?.lists?.lists &&
              ` of ${active_subscription?.details?.lists?.lists}`}
          </Heading>
          <Text fontSize="0.75rem">
            {active_subscription?.details?.lists?.lists
              ? 'You can increase your list limits by upgrading your subscription plan'
              : 'You have no limits on the number of lists you can create'}
          </Text>
        </Stack>
        {active_subscription?.details?.lists?.lists && (
          <Button
            variantColor="blue"
            size="xs"
            onClick={() => router_history.push('/s/settings/organization/billing')}
          >
            Upgrade
          </Button>
        )}
      </Box>
    </div>
  );
};
