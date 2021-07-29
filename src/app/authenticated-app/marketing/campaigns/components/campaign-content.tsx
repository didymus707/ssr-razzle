import { Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/core';
import { ListSearch } from 'app/authenticated-app/lists/components/search';
import React from 'react';
import { EmptyState, TableDropdownAction } from '../../../../components';
import emptyClipImage from '../assets/search-user.svg';
import { CAMPAIGN_LIST_LIMIT } from '../campaigns.service';
import { CampaignData, CampaignTypes } from '../campaigns.types';
import { CampaignListItem } from './campaign-list-item';
import { CampaignTablePagination } from './campaign-table-pagination';

type Props = {
  end: number;
  page: number;
  start: number;
  total_count: number;
  isLoading?: boolean;
  searchQuery?: string;
  selectedTab: CampaignTypes;
  campaignsList: CampaignData[];
  onSearch(query: string): void;
  onPagination(page: number): void;
  onTabChange: (tab: CampaignTypes) => void;
  stateOptions: { label: string; value: CampaignTypes }[];
  getTableActions(data: CampaignData): TableDropdownAction<CampaignData>[];
};

export const CampaignContent = (props: Props) => {
  const {
    end,
    page,
    start,
    onSearch,
    isLoading,
    searchQuery,
    onTabChange,
    selectedTab,
    total_count,
    stateOptions,
    onPagination,
    campaignsList,
    getTableActions,
  } = props;
  return (
    <div>
      <Box className="section-title">
        <Stack isInline alignItems="center">
          <Stack spacing="0" isInline rounded="4px" borderWidth="1px" alignItems="center">
            {stateOptions.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === stateOptions.length - 1;

              let borderRadiusStyles = {};

              if (isFirst) {
                borderRadiusStyles = {
                  roundedTopLeft: '4px',
                  roundedBottomLeft: '4px',
                };
              }
              if (isLast) {
                borderRadiusStyles = {
                  roundedTopRight: '4px',
                  roundedBottomRight: '4px',
                };
              }

              return (
                <Box
                  py="0.4rem"
                  width="94px"
                  fontWeight="500"
                  cursor="pointer"
                  textAlign="center"
                  fontSize="0.875rem"
                  borderRightWidth={isLast ? '0' : '1px'}
                  onClick={() => onTabChange(item.value)}
                  color={selectedTab === item.value ? 'white' : 'black'}
                  backgroundColor={selectedTab === item.value ? 'blue.500' : 'transparent'}
                  {...borderRadiusStyles}
                >
                  {item.label}
                </Box>
              );
            })}
          </Stack>

          <ListSearch
            height="36px"
            focusWidth="150px"
            search_query={searchQuery ?? ''}
            updateSearchQuery={onSearch}
          />
        </Stack>
        <Stack isInline alignItems="center">
          <Stack isInline alignItems="center">
            <Text fontSize="0.8rem" fontWeight={500} color="gray.900">
              Viewing {start}-{total_count < end ? total_count : end} of {total_count}
            </Text>
            <CampaignTablePagination
              page={page}
              onClick={onPagination}
              metaData={{
                pageCount: CAMPAIGN_LIST_LIMIT,
                noOfPages: Math.ceil(total_count / CAMPAIGN_LIST_LIMIT),
              }}
            />
          </Stack>
        </Stack>
      </Box>
      {isLoading ? (
        <Stack>
          {Array.from({ length: 15 }, (v, i) => (
            <Stack
              isInline
              px="1rem"
              pt="1rem"
              borderTopWidth="1px"
              key={`${i.toString()}-${new Date().getTime()}`}
            >
              <Box width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}>
                <Skeleton height="10px" width="80%" my="10px" />
                <Skeleton height="10px" width="50%" my="10px" />
                <Skeleton height="10px" width="25%" my="10px" />
              </Box>
              <Flex
                justifyContent="flex-end"
                width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}
              >
                <Skeleton height="10px" width="60px" my="10px" />
              </Flex>
              <Flex
                justifyContent="flex-end"
                width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}
              >
                <Skeleton height="10px" width="60px" my="10px" />
              </Flex>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Box>
          {!campaignsList?.length ? (
            <EmptyState
              py="100px"
              imageSize="120px"
              image={emptyClipImage}
              heading="No campaigns created yet"
              contentContainerProps={{ mt: '1rem' }}
              subheading="Send campaigns to your lists, segments or new audiences."
            />
          ) : (
            campaignsList?.map(campaign => (
              <CampaignListItem
                key={campaign.id}
                campaign={campaign}
                isLoading={isLoading}
                getTableActions={getTableActions}
              />
            ))
          )}
        </Box>
      )}
    </div>
  );
};
