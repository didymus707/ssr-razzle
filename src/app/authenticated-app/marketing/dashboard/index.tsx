import { Box, Flex, Heading, PseudoBox, Skeleton, Text, useDisclosure } from '@chakra-ui/core';
import { Button, EmptyState } from 'app/components';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { numberWithCommas } from '../../../../utils';
import { CampaignMetaModal, getDashboardData } from '../campaigns';
import emptyClipImage from '../campaigns/assets/search-user.svg';
import {
  DashboardTable,
  DashboardTableItem,
  DashboardTableLoadingItem,
  DateFilter,
  DateFilterDropdown,
} from './components';

const dateFilters: DateFilter[] = [
  { label: 'last 7 days', value: 7 },
  { label: 'last 14 days', value: 14 },
  { label: 'last 28 days', value: 28 },
];

export const MarketingDashboard = () => {
  const history = useHistory();
  const {
    isOpen: isCreateCampaignModalOpen,
    onClose: onCloseCreateCampaignModal,
    onOpen: onOpenCreateCampaignModal,
  } = useDisclosure();

  const [activeCouponFilter, setActiveCouponFilter] = useState(7);
  const [activeCampaignFilter, setActiveCampaignFilter] = useState(7);

  const { data: campaignData, isLoading: isFetchingCampaignData } = useQuery(
    ['marketing-dashboard-campaigns', activeCampaignFilter, 'sms'],
    () => getDashboardData({ period: activeCampaignFilter }),
  );
  const { data: couponData, isLoading: isFetchingCouponData } = useQuery(
    ['marketing-dashboard-coupons', activeCouponFilter, 'coupon'],
    () => getDashboardData({ period: activeCouponFilter, type: 'coupon' }),
  );

  const getCVRComparison = useCallback((data: any) => {
    const { current_reports = {}, previous_reports = {} } = data ?? {};
    const averageCVRDiff =
      (current_reports?.average_cvr ?? 0) - (previous_reports?.average_cvr ?? 0);
    const absoluteAverageCVRDiff = Math.abs(averageCVRDiff);
    if (averageCVRDiff > 0) {
      return {
        color: 'green.500',
        text: `is up ${absoluteAverageCVRDiff.toFixed(1)}%`,
      };
    }
    if (averageCVRDiff > 0) {
      return { color: 'red.500', text: `is down ${absoluteAverageCVRDiff.toFixed(1)}%` };
    }
    return { color: '#4f4f4f', text: `is same` };
  }, []);

  const handleCreateCouponClick = () => {
    history.push(`/s/marketing/coupons/new/`);
  };

  const handleCreateOneTimeCampaign = () => {
    history.push('/s/marketing/campaigns/new/one-time-campaign');
  };

  const handleABTestCampaign = () => {
    history.push('/s/marketing/campaigns/new/ab-test-campaign');
  };

  const renderCampaignTableItem = (item: any, index: number) => {
    return (
      <DashboardTableItem
        item={item}
        key={`${index}`}
        onClick={() => history.push(`/s/marketing/campaigns/${item.id}/analytics`)}
      />
    );
  };

  const renderCampaignTableLoadingItem = (item: any, index: number) => {
    return <DashboardTableLoadingItem key={`${index}`} />;
  };

  return (
    <Box>
      <Box mb="2.5rem">
        <Flex mb="1.5rem" alignItems="center" justifyContent="space-between">
          <Box>
            <Heading as="h4" fontSize="1.2rem" fontWeight={600} color="black">
              Campaigns Sent
            </Heading>
            <DateFilterDropdown
              filters={dateFilters}
              onFilterChange={filter => setActiveCampaignFilter(filter.value)}
            />
          </Box>
          <Button size="sm" variantColor="blue" onClick={onOpenCreateCampaignModal}>
            Create campaign
          </Button>
        </Flex>
        <Flex mb="1.5rem" justifyContent="space-between">
          <Box>
            {isFetchingCampaignData ? (
              <Skeleton height="24px" width="100px" />
            ) : (
              <Heading as="h4" fontSize="1.2rem" fontWeight="bold" color="black">
                {numberWithCommas(campaignData?.current_reports?.total_sent)}
              </Heading>
            )}
            {isFetchingCampaignData ? (
              <Box width="400px">
                <Skeleton height="10px" width="80%" my="8px" />
              </Box>
            ) : (
              <Text maxW="500px" color="#4f4f4f" fontWeight="medium" fontSize="0.875rem">
                Average message conversion rate{' '}
                <PseudoBox
                  as="span"
                  fontWeight="bold"
                  color={getCVRComparison(campaignData)?.color}
                >
                  {getCVRComparison(campaignData).text}
                </PseudoBox>{' '}
                over the last {activeCampaignFilter} days.
              </Text>
            )}
          </Box>
          <Box>
            {isFetchingCampaignData ? (
              <Box width="85px">
                <Skeleton height="10px" width="100%" my="8px" />
                <Skeleton height="10px" width="100%" />
              </Box>
            ) : (
              <>
                <Text fontWeight={500} color="#4f4f4f" fontSize="0.875rem">
                  {!!campaignData?.current_reports?.average_cvr
                    ? parseFloat(campaignData?.current_reports?.average_cvr).toFixed(1)
                    : 0}
                  %
                </Text>
                <Text fontWeight={500} color="#4f4f4f" fontSize="0.875rem">
                  Average CVR
                </Text>
              </>
            )}
          </Box>
        </Flex>
        {isFetchingCampaignData ? (
          <DashboardTable<any>
            data={Array.from({ length: 7 })}
            renderItem={renderCampaignTableLoadingItem}
            headings={['title', 'sent', 'delivered', 'ctr', 'cvr']}
          />
        ) : !!campaignData?.current_reports?.reports.length ? (
          <DashboardTable<any>
            renderItem={renderCampaignTableItem}
            data={campaignData?.current_reports?.reports ?? []}
            headings={['title', 'sent', 'delivered', 'ctr', 'cvr']}
          />
        ) : (
          <EmptyState
            py="100px"
            imageSize="120px"
            image={emptyClipImage}
            heading="No campaigns created yet"
            contentContainerProps={{ mt: '1rem' }}
            subheading="Send campaigns to your lists, segments or new audiences."
          />
        )}
      </Box>
      <Box>
        <Flex mb="1.5rem" alignItems="center" justifyContent="space-between">
          <Box>
            <Heading as="h4" fontSize="1.2rem" fontWeight={600} color="black">
              Coupons Sent
            </Heading>
            <DateFilterDropdown
              filters={dateFilters}
              onFilterChange={filter => setActiveCouponFilter(filter.value)}
            />
          </Box>
          <Button size="sm" variantColor="blue" onClick={handleCreateCouponClick}>
            Create coupon set
          </Button>
        </Flex>
        <Flex mb="1.5rem" justifyContent="space-between">
          <Box>
            {isFetchingCouponData ? (
              <Skeleton height="24px" width="100px" />
            ) : (
              <Heading as="h4" fontSize="1.2rem" fontWeight={600} color="black">
                {numberWithCommas(couponData?.current_reports?.total_sent)}
              </Heading>
            )}
            {isFetchingCouponData ? (
              <Box width="400px">
                <Skeleton height="10px" width="80%" my="8px" />
              </Box>
            ) : (
              <Text maxW="500px" color="#4f4f4f" fontWeight={500} fontSize="0.875rem">
                Average message conversion rate is up{' '}
                <PseudoBox as="span" color={getCVRComparison(couponData)?.color} fontWeight="bold">
                  {getCVRComparison(couponData).text}
                </PseudoBox>{' '}
                over the last {activeCouponFilter} days.
              </Text>
            )}
          </Box>
          <Box>
            {isFetchingCouponData ? (
              <Box width="85px">
                <Skeleton height="10px" width="100%" my="8px" />
                <Skeleton height="10px" width="100%" />
              </Box>
            ) : (
              <>
                <Text fontWeight={500} color="#4f4f4f" fontSize="0.875rem">
                  {!!couponData?.current_reports?.average_cvr
                    ? parseFloat(couponData?.current_reports?.average_cvr).toFixed(1)
                    : 0}
                  %
                </Text>
                <Text fontWeight={500} color="#4f4f4f" fontSize="0.875rem">
                  Average CVR
                </Text>
              </>
            )}
          </Box>
        </Flex>
        {isFetchingCouponData ? (
          <DashboardTable<any>
            data={Array.from({ length: 7 })}
            renderItem={renderCampaignTableLoadingItem}
            headings={['title', 'sent', 'delivered', 'ctr', 'cvr']}
          />
        ) : !!couponData?.current_reports.reports.length ? (
          <DashboardTable<any>
            renderItem={renderCampaignTableItem}
            data={couponData?.current_reports?.reports ?? []}
            headings={['title', 'sent', 'delivered', 'ctr', 'cvr']}
          />
        ) : (
          <EmptyState
            py="100px"
            imageSize="120px"
            image={emptyClipImage}
            heading="No coupons created yet"
            contentContainerProps={{ mt: '1rem' }}
            subheading="Send coupons to your lists, segments or new audiences."
          />
        )}
      </Box>
      <CampaignMetaModal
        title="Create a campaign"
        isOpen={isCreateCampaignModalOpen}
        onClose={onCloseCreateCampaignModal}
        options={[
          {
            icon: 'single-campaign',
            title: 'One-time message',
            caption:
              'Keep subscribers engaged and drive revenue by sharing your latest news or promoting a product or sale.',
            onSelect: handleCreateOneTimeCampaign,
            showButton: false,
          },
          {
            icon: 'multi-campaign',
            title: 'A/B test',
            caption:
              'Send up to four variants of a single message, testing text to determine which perform best.',
            onSelect: handleABTestCampaign,
            showButton: false,
          },
        ]}
      />
    </Box>
  );
};
