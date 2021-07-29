import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveSubscription } from 'app/authenticated-app/settings';
import React, { ChangeEvent } from 'react';
import { Button, Input } from 'app/components';
import { Box, Heading, Icon, Stack, Text } from '@chakra-ui/core';
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
  { key: 'lists', label: 'Lists', icon: 'grid2', children: ['favorites', 'trash'] },
  { key: 'smart', label: 'Smart Lists', icon: 'grid2', children: [] },
  { key: 'connections', label: 'Connections', icon: 'connection', children: [] },
  { key: 'data-models', label: 'Data Models', icon: 'dataModel', children: [] },
  { key: 'segments', label: 'Segments', icon: 'segment-2', children: [] },
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
          className="search-input"
          variant="filled"
          placeholder="Search"
          onChange={handleSearchInputChange}
        />
        {['lists', 'smart', 'trash', 'favorites'].includes(selectedTab) && (
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
        )}
      </div>
      <div>
        {tab_options.map((i: any, index: any) => (
          <div
            key={index}
            className={`option-item ${selectedTab === i.key && 'active'}`}
            onClick={() => props.selectTab(i.key)}
          >
            <Icon
              name={i.icon}
              size="16px"
              marginRight="10px"
              color={
                selectedTab === i.key || i.children.includes(selectedTab) ? '#3525E6' : '#A5ABB3'
              }
            />
            <Box
              className="text"
              color={
                selectedTab === i.key || i.children.includes(selectedTab) ? '#3525E6' : '#A5ABB3'
              }
            >
              {i.label}
            </Box>
          </div>
        ))}
      </div>

      <Box p="0.75rem 1rem" bg="#e8f7ff" rounded="5px" mt="15px">
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
