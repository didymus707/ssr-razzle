import { Box, Flex, Heading, Text, useDisclosure, useToast } from '@chakra-ui/core';
import { Button } from 'app/components';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import { ConfirmModal, TableDropdownAction, ToastBox } from '../../../components';
import {
  CAMPAIGN_LIST_LIMIT,
  deleteCampaignItem,
  filterCampaigns,
  saveCampaignItemState,
  searchCampaigns,
} from './campaigns.service';
import { CampaignComponentProps, CampaignData, CampaignTypes } from './campaigns.types';
import { CampaignContent, CampaignMetaModal, CampaingPreviewModal } from './components';

export function CampaignsComponent(props: CampaignComponentProps) {
  const { history } = props;
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    isOpen: isCreateCampaignModalOpen,
    onClose: onCloseCreateCampaignModal,
    onOpen: onOpenCreateCampaignModal,
  } = useDisclosure();

  const [page, setPage] = useState(1);
  const [start, setStart] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [end, setEnd] = useState(CAMPAIGN_LIST_LIMIT);
  const [activeTab, setActiveTab] = useState<CampaignTypes>();
  const [campaignToDelete, setCampaignToDelete] = useState<CampaignData | undefined>();
  const [campaignToPreview, setCampaignToPreview] = useState<CampaignData | undefined>();

  async function handleFilterCampaigns({ page, query }: { page: number; query?: CampaignTypes }) {
    try {
      const { data } = await filterCampaigns({ page, query });
      return data;
    } catch (error) {}
  }

  function handleSearchCampaigns(query: string) {
    setSearchQuery(query);
  }

  function handleCampaignStateChange(campaign: CampaignData, state: CampaignData['state']) {
    mutateCampaignState({ campaign, state });
  }

  function handleCampaignDelete() {
    if (campaignToDelete) {
      mutateDeleteCampaign(campaignToDelete);
    }
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

  function handleTabChange(tab: CampaignTypes) {
    setActiveTab(tab);
    setPage(1);
    setStart(1);
    setEnd(CAMPAIGN_LIST_LIMIT);
  }

  function handleEditCampaign(campaign: CampaignData) {
    history.push(`/s/marketing/campaigns/${campaign.id}`);
  }

  function handleCreateOneTimeCampaign() {
    history.push('/s/marketing/campaigns/new/one-time-campaign');
  }

  function handleABTestCampaign() {
    history.push('/s/marketing/campaigns/new/ab-test-campaign');
  }

  function handleViewCampaignStats(campaign: CampaignData) {
    sendAmplitudeData('viewCampaignStats');
    history.push(`/s/marketing/campaigns/${campaign.id}/analytics`);
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

  const { data, isLoading: isFetchingCampaigns } = useQuery(
    ['campaigns', page, activeTab],
    () => handleFilterCampaigns({ page, query: activeTab }),
    { keepPreviousData: true },
  );

  const { data: searchResults, isLoading: isSearchingCampaigns } = useQuery(
    ['campaigns', searchQuery],
    () => searchCampaigns({ query: searchQuery || undefined, state: activeTab }),
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
        await queryClient.cancelQueries(['campaigns', page, activeTab]);
        const previousCampaigns = queryClient.getQueryData(['campaigns', page, activeTab]);
        queryClient.setQueryData(['campaigns', page, activeTab], old => ({
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
        queryClient.invalidateQueries(['campaigns', page, activeTab]);
        sendAmplitudeData('campaignStateChanged', { state: newData.state });
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(['campaigns', page, activeTab], context.previousCampaigns);
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
      await queryClient.cancelQueries(['campaigns', page, activeTab]);
      const previousCampaigns = queryClient.getQueryData(['campaigns', page, activeTab]);
      queryClient.setQueryData(['campaigns', page, activeTab], old => ({
        //@ts-ignore
        ...old,
        //@ts-ignore
        campaigns: old?.campaigns.filter(campaign => campaign.id !== id),
      }));
      return { previousCampaigns };
    },
    onSuccess: newData => {
      queryClient.invalidateQueries(['campaigns', page, activeTab]);
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
      queryClient.setQueryData(['campaigns', page, activeTab], context.previousCampaigns);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    },
  });

  return (
    <>
      <Flex pb="2.5rem" alignItems="center" justifyContent="space-between">
        <Box>
          <Heading as="h4" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
            Campaigns
          </Heading>
          <Text maxW="500px" color="#4f4f4f" fontSize="0.875rem">
            Easily design and send targeted messages to reach your customers throughout their
            lifecycle.
          </Text>
        </Box>
        <Button size="sm" variantColor="blue" onClick={onOpenCreateCampaignModal}>
          Create campaign
        </Button>
      </Flex>
      <CampaignContent
        end={end}
        page={page}
        start={start}
        selectedTab={activeTab}
        onTabChange={handleTabChange}
        onPagination={handlePagination}
        onSearch={handleSearchCampaigns}
        getTableActions={getTableActions}
        total_count={data?.meta?.count_total}
        stateOptions={[
          { label: 'All', value: undefined },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Sent', value: 'sent' },
          { label: 'Draft', value: 'draft' },
        ]}
        campaignsList={searchResults ?? data?.campaigns}
        isLoading={isFetchingCampaigns || isSearchingCampaigns}
      />
      <ConfirmModal
        title="Delete campaign"
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
              'Send up to four variants of a single message, testing text or images to determine which perform best.',
            onSelect: handleABTestCampaign,
            showButton: false,
          },
        ]}
      />
    </>
  );
}
