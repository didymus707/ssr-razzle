import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/core';
import { Button, ConfirmModal, TableDropdownAction, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { sendAmplitudeData } from 'utils/amplitude';
import {
  CampaignContent,
  CAMPAIGN_LIST_LIMIT,
  CampaingPreviewModal,
  deleteCampaignItem,
  filterCoupons,
  saveCampaignItemState,
  searchCoupons,
} from '../campaigns';
import { CampaignData, CampaignTypes } from '../campaigns/campaigns.types';

export const MarketingCoupons = () => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [start, setStart] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [end, setEnd] = React.useState(CAMPAIGN_LIST_LIMIT);
  const [activeTab, setActiveTab] = React.useState<CampaignTypes>();
  const [campaignToDelete, setCampaignToDelete] = React.useState<CampaignData | undefined>();
  const [campaignToPreview, setCampaignToPreview] = React.useState<CampaignData | undefined>();

  async function handleFilterCampaigns({ page, query }: { page: number; query?: CampaignTypes }) {
    try {
      const { data } = await filterCoupons({ page, query });
      return data;
    } catch (error) {}
  }

  function handleSearchCampaigns(query: string) {
    setSearchQuery(query);
  }

  function handleCreateCouponClick() {
    history.push('/s/marketing/coupons/new/');
  }

  function handleCampaignStateChange(campaign: CampaignData, state: CampaignData['state']) {
    mutateCampaignState({ campaign, state });
  }

  function handleCampaignDelete() {
    if (campaignToDelete) {
      mutateDeleteCampaign(campaignToDelete);
    }
  }

  function handleTabChange(tab: CampaignTypes) {
    setActiveTab(tab);
    setPage(1);
    setStart(1);
    setEnd(CAMPAIGN_LIST_LIMIT);
  }

  function handlePagination(pageNumber: number) {
    if (pageNumber > page) {
      setStart(start + CAMPAIGN_LIST_LIMIT);
      setEnd(end + CAMPAIGN_LIST_LIMIT);
    } else {
      setStart(start - CAMPAIGN_LIST_LIMIT);
      setEnd(end - CAMPAIGN_LIST_LIMIT);
    }
    setPage(pageNumber);
  }

  function handleEditCampaign(coupon: CampaignData) {
    history.push(`/s/marketing/coupons/${coupon.id}`);
  }

  function handleViewCampaignStats(coupon: CampaignData) {
    sendAmplitudeData('viewCampaignStats');
    history.push(`/s/marketing/campaigns/${coupon.id}/analytics`);
  }

  function getTableActions(data: CampaignData) {
    const tableActionsStart = [
      {
        icon: 'play',
        label: 'Start campaign',
        onClick: (data: CampaignData) => handleCampaignStateChange(data, 'started'),
      },
      {
        icon: 'info',
        label: 'Preview campaign',
        onClick: (data: CampaignData) => setCampaignToPreview(data),
      },
      {
        icon: 'edit',
        label: 'Edit campaign',
        onClick: (data: CampaignData) => handleEditCampaign(data),
      },
      {
        icon: 'delete',
        label: 'Delete campaign',
        onClick: (data: CampaignData) => setCampaignToDelete(data),
      },
    ] as TableDropdownAction<CampaignData>[];

    const tableActionsPause = [
      {
        icon: 'pause',
        label: 'Pause campaign',
        onClick: (data: CampaignData) => {
          const state = data.state === 'started' ? 'paused' : 'started';
          handleCampaignStateChange(data, state);
        },
      },
      {
        icon: 'stop',
        label: 'Stop campaign',
        onClick: (data: CampaignData) => handleCampaignStateChange(data, 'stopped'),
      },
      {
        icon: 'info',
        label: 'Preview campaign',
        onClick: (data: CampaignData) => {
          sendAmplitudeData('previewCampaign', { data });
          setCampaignToPreview(data);
        },
      },
      {
        icon: 'view',
        label: 'View stats',
        onClick: (data: CampaignData) => handleViewCampaignStats(data),
      },
      {
        icon: 'edit',
        label: 'Edit campaign',
        onClick: (data: CampaignData) => handleEditCampaign(data),
      },
      {
        icon: 'delete',
        label: 'Delete campaign',
        onClick: (data: CampaignData) => setCampaignToDelete(data),
      },
    ] as TableDropdownAction<CampaignData>[];

    if (data.state === 'pristine') {
      return tableActionsStart;
    }

    if (data.state === 'paused') {
      return [
        {
          icon: 'play',
          label: 'Start campaign',
          onClick: (data: CampaignData) => handleCampaignStateChange(data, 'started'),
        },
        {
          icon: 'info',
          label: 'Preview campaign',
          onClick: (data: CampaignData) => setCampaignToPreview(data),
        },
        {
          icon: 'view',
          label: 'View stats',
          onClick: (data: CampaignData) => handleViewCampaignStats(data),
        },
        {
          icon: 'delete',
          label: 'Delete campaign',
          onClick: (data: CampaignData) => setCampaignToDelete(data),
        },
      ];
    }

    if (data.state === 'stopped') {
      return [
        {
          icon: 'info',
          label: 'Preview campaign',
          onClick: (data: CampaignData) => setCampaignToPreview(data),
        },
        {
          icon: 'view',
          label: 'View stats',
          onClick: (data: CampaignData) => handleViewCampaignStats(data),
        },
        {
          icon: 'delete',
          label: 'Delete campaign',
          onClick: (data: CampaignData) => setCampaignToDelete(data),
        },
      ];
    }

    if (data.state === 'draft') {
      return [
        {
          icon: 'info',
          label: 'Preview campaign',
          onClick: (data: CampaignData) => setCampaignToPreview(data),
        },
        {
          icon: 'edit',
          label: 'Edit campaign',
          onClick: (data: CampaignData) => handleEditCampaign(data),
        },
        {
          icon: 'delete',
          label: 'Delete campaign',
          onClick: (data: CampaignData) => setCampaignToDelete(data),
        },
      ];
    }

    if (data.state === 'started' && !!data.schedule_start) {
      return [
        {
          icon: 'pause',
          label: 'Pause campaign',
          onClick: (data: CampaignData) => {
            const state = data.state === 'started' ? 'paused' : 'started';
            handleCampaignStateChange(data, state);
          },
        },
        {
          icon: 'stop',
          label: 'Stop campaign',
          onClick: (data: CampaignData) => handleCampaignStateChange(data, 'stopped'),
        },
        {
          icon: 'info',
          label: 'Preview campaign',
          onClick: (data: CampaignData) => setCampaignToPreview(data),
        },
        {
          icon: 'view',
          label: 'View stats',
          onClick: (data: CampaignData) => handleViewCampaignStats(data),
        },
        {
          icon: 'delete',
          label: 'Delete campaign',
          onClick: (data: CampaignData) => setCampaignToDelete(data),
        },
      ];
    }

    if (data.state === 'completed' || (data.state && data.schedule_start === null)) {
      return [
        {
          icon: 'view',
          label: 'View stats',
          onClick: (data: CampaignData) => handleViewCampaignStats(data),
        },
        {
          icon: 'info',
          label: 'Preview campaign',
          onClick: (data: CampaignData) => setCampaignToPreview(data),
        },
        {
          icon: 'delete',
          label: 'Delete campaign',
          onClick: (data: CampaignData) => setCampaignToDelete(data),
        },
      ];
    }

    return tableActionsPause;
  }

  const { data, isLoading: isFetchingCoupons } = useQuery(
    ['coupons', page, activeTab],
    () => handleFilterCampaigns({ page, query: activeTab }),
    { keepPreviousData: true },
  );

  const { data: searchResults, isLoading: isSearchingCampaigns } = useQuery(
    ['coupons', searchQuery],
    () => searchCoupons({ query: searchQuery || undefined, state: activeTab }),
    { enabled: !!searchQuery },
  );

  const { mutate: mutateCampaignState } = useMutation<any, AxiosError, any, any>(
    (payload: { campaign: CampaignData; state: CampaignData['state'] }) =>
      saveCampaignItemState({ id: payload.campaign.id, state: payload.state }),
    {
      onMutate: async payload => {
        const { campaign, state } = payload;
        const { id } = campaign;
        const newData = { ...campaign, state };
        await queryClient.cancelQueries(['coupons', page, activeTab]);
        const previousCampaigns = queryClient.getQueryData(['coupons', page, activeTab]);
        queryClient.setQueryData(['coupons', page, activeTab], old => ({
          //@ts-ignore
          ...old,
          //@ts-ignore
          campaigns: old?.campaigns.map(campaign => {
            if (campaign.id === id) {
              return newData;
            }
            return campaign;
          }),
        }));
        return { previousCampaigns };
      },
      onSuccess: newData => {
        queryClient.invalidateQueries(['coupons', page, activeTab]);
        sendAmplitudeData('campaignStateChanged', { state: newData.state });
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(['coupons', page, activeTab], context.previousCampaigns);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const { isLoading: isDeleting, mutate: mutateDeleteCampaign } = useMutation<
    any,
    AxiosError,
    any,
    any
  >((campaign: CampaignData) => deleteCampaignItem({ id: campaign.id }), {
    onMutate: async payload => {
      const { id } = payload;
      await queryClient.cancelQueries(['coupons', page, activeTab]);
      const previousCampaigns = queryClient.getQueryData(['coupons', page, activeTab]);
      queryClient.setQueryData(['coupons', page, activeTab], old => ({
        //@ts-ignore
        ...old,
        //@ts-ignore
        campaigns: old?.campaigns.filter(campaign => campaign.id !== id),
      }));
      return { previousCampaigns };
    },
    onSuccess: newData => {
      queryClient.invalidateQueries(['coupons', page, activeTab]);
      setCampaignToDelete(undefined);
      sendAmplitudeData('campaignDeleted');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Campaign deleted successfully" />
        ),
      });
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['coupons', page, activeTab], context.previousCampaigns);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    },
  });

  return (
    <Box>
      <Flex pb="2.5rem" alignItems="center" justifyContent="space-between">
        <Box>
          <Heading as="h4" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
            Coupons
          </Heading>
          <Text maxW="500px" color="#4f4f4f" fontSize="0.875rem">
            Add or edit coupon sets.
          </Text>
        </Box>
        <Button size="sm" variantColor="blue" onClick={handleCreateCouponClick}>
          Create coupon set
        </Button>
      </Flex>
      <CampaignContent
        end={end}
        page={page}
        start={start}
        selectedTab={activeTab}
        searchQuery={searchQuery}
        onTabChange={handleTabChange}
        onPagination={handlePagination}
        onSearch={handleSearchCampaigns}
        getTableActions={getTableActions}
        total_count={data?.meta?.count_total}
        stateOptions={[
          { label: 'All', value: undefined },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Sent', value: 'sent' },
        ]}
        campaignsList={searchResults ?? data?.campaigns}
        isLoading={isFetchingCoupons || isSearchingCampaigns}
      />
      <ConfirmModal
        title="Delete coupon"
        isLoading={isDeleting}
        isOpen={!!campaignToDelete}
        onConfirm={handleCampaignDelete}
        onClose={() => setCampaignToDelete(undefined)}
      />
      <CampaingPreviewModal
        campaign={campaignToPreview}
        isOpen={!!campaignToPreview}
        onClose={() => setCampaignToPreview(undefined)}
      />
    </Box>
  );
};
