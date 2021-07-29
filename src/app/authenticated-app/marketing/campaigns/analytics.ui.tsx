import { Box, Icon, Progress, Stack, Text, useDisclosure } from '@chakra-ui/core';
import { format } from 'date-fns';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLoading } from '../../../../hooks';
import { ContentWrapper, EmptyState, Button, Subtitle } from 'app/components';
import { CampaignAnalyticsUIProps } from './analytics.types';
import { BottomCard, CampaignMetaModal } from './components';
import { Line } from 'react-chartjs-2';
import emailSent from './assets/email-sent.svg';
import { numberWithCommas } from '../../../../utils';

export const CampaginAnalyticsUI = (props: CampaignAnalyticsUIProps) => {
  const { history, campaign, fetchCampaign } = props;
  const { id: routeID } = useParams<{ id: string }>();

  const {
    name,
    clicks,
    reports,
    total_sent,
    total_dnd,
    total_delivered,
    created_datetime,
  } = campaign;

  const createdTime = created_datetime && format(new Date(created_datetime), 'MMMM dd yyyy');
  const conversionRate =
    clicks?.total_clicks && total_sent ? Math.ceil((clicks?.total_clicks / total_sent) * 100) : 0;

  const { dispatch } = useLoading();
  const {
    isOpen: isCreateCampaignModalOpen,
    onClose: onCloseCreateCampaignModal,
    onOpen: onOpenCreateCampaignModal,
  } = useDisclosure();

  React.useEffect(() => {
    let mounted = true;

    if (routeID) {
      const fetchData = async () => {
        try {
          dispatch({ type: 'GLOBAL_LOADING_STARTED' });
          await fetchCampaign(routeID, true);
          if (mounted) {
            dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
          }
        } catch (error) {
          dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
        }
      };
      fetchData();
    }
    return () => {
      mounted = false;
    };
  }, [routeID, fetchCampaign, dispatch]);

  React.useEffect(() => {
    let mounted = true;

    if (routeID) {
      const fetchStatsData = async () => {
        try {
          dispatch({ type: 'GLOBAL_LOADING_STARTED' });

          if (mounted) {
            dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
          }
        } catch (error) {
          dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
        }
      };
      fetchStatsData();
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, routeID]);

  function handleCreateOneTimeCampaign() {
    history.push('/s/marketing/campaigns/new/one-time-campaign');
  }

  function handleABTestCampaign() {
    history.push('/s/marketing/campaigns/new/ab-test-campaign');
  }

  return (
    <ContentWrapper paddingBottom={['12rem', '12rem', '8rem']}>
      <Box paddingX="1.5rem">
        <Stack isInline spacing="1rem" alignItems="center" pt="0.8rem" pb="2rem">
          <Box>
            <Link to="/s/marketing/campaigns">
              <Icon name="arrow-back" />
            </Link>
          </Box>
          <Box>
            <Subtitle color="blue.500" fontSize="1.25rem">
              {name}
            </Subtitle>
          </Box>
          <Box>
            <Text color="#595e8a" fontSize="1rem">
              {createdTime}
            </Text>
          </Box>
        </Stack>

        {reports && (
          <BottomCard label="Engagement Details">
            <Line
              height={80}
              data={{
                labels: Object.keys(reports)
                  .sort((a, b) => {
                    const dateA = a && new Date(a).getTime();
                    const dateB = b && new Date(b).getTime();
                    if (dateA && dateB) {
                      return dateA - dateB;
                    }
                    return 0;
                  })
                  .map((i: any) => format(new Date(i), 'dd/MM')),
                datasets: [
                  {
                    fill: false,
                    label: 'No. of clicks',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                    data: Object.keys(reports)
                      .sort((a, b) => {
                        const dateA = a && new Date(a).getTime();
                        const dateB = b && new Date(b).getTime();
                        if (dateA && dateB) {
                          return dateA - dateB;
                        }
                        return 0;
                      })
                      .map((i: any) => reports[i].total_click | 0),
                  },
                ],
              }}
              options={{
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              }}
            />
          </BottomCard>
        )}
        <Stack isInline pb="80px" height="400px" flexWrap="wrap" spacing={['0', '0', '0', '1rem']}>
          <BottomCard
            label="Conversion Details"
            width={['100%', '100%', '100%', 'calc(50% - 0.5rem)']}
          >
            <Stack pt="1rem" spacing="1.5rem">
              {/* <Stack isInline alignItems="center">
                <Text width="25%">Audience</Text>
                <Text fontWeight="700">{numberWithCommas(audience?.count ?? 0)}</Text>
              </Stack> */}
              <Stack isInline alignItems="center">
                <Text width="25%">SMS Sent</Text>
                <Progress
                  flex={1}
                  size="sm"
                  width="100%"
                  rounded="100px"
                  value={total_sent ? (total_sent / total_sent) * 100 : 0}
                />
                <Text width="25%">
                  {total_sent ? (total_sent / total_sent) * 100 : 0}% (
                  {numberWithCommas(total_sent)})
                </Text>
              </Stack>
              <Stack isInline alignItems="center">
                <Text width="25%">SMS Delivered</Text>
                <Progress
                  flex={1}
                  size="sm"
                  width="100%"
                  rounded="100px"
                  value={total_delivered && total_sent ? (total_delivered / total_sent) * 100 : 0}
                />
                <Text width="25%">
                  {Math.ceil(
                    total_delivered && total_sent ? (total_delivered / total_sent) * 100 : 0,
                  )}
                  % ({numberWithCommas(total_delivered)})
                </Text>
              </Stack>
              <Stack isInline alignItems="center">
                <Text width="25%">SMS DND</Text>
                <Progress
                  flex={1}
                  size="sm"
                  width="100%"
                  rounded="100px"
                  value={total_dnd && total_sent ? (total_dnd / total_sent) * 100 : 0}
                />
                <Text width="25%">
                  {Math.ceil(total_dnd && total_sent ? (total_dnd / total_sent) * 100 : 0)}% (
                  {numberWithCommas(total_dnd)})
                </Text>
              </Stack>
              <Stack isInline alignItems="center">
                <Text width="25%">Links Opened</Text>
                <Progress
                  flex={1}
                  size="sm"
                  width="100%"
                  rounded="100px"
                  value={
                    clicks?.total_clicks && total_sent
                      ? (clicks?.total_clicks / total_sent) * 100
                      : 0
                  }
                />
                <Text width="25%">
                  {Math.ceil(
                    clicks?.total_clicks && total_sent
                      ? (clicks?.total_clicks / total_sent) * 100
                      : 0,
                  )}
                  % ({numberWithCommas(clicks?.total_clicks)})
                </Text>
              </Stack>
              <Stack isInline alignItems="center">
                <Text width="25%">Conversion</Text>
                <Progress flex={1} size="sm" width="100%" rounded="100px" value={conversionRate} />
                <Text width="25%">{conversionRate}%</Text>
              </Stack>
              <Text fontWeight="normal" fontSize="0.7rem">
                Conversion = links opened % sent
              </Text>
            </Stack>
          </BottomCard>
          <BottomCard width={['100%', '100%', '100%', 'calc(50% - 0.5rem)']}>
            <EmptyState
              width="400px"
              imageSize="100px"
              image={emailSent}
              heading="Ready to send your next campaign?"
              subheading="Send campaigns to your lists, segments or new audiences."
            >
              <Button variantColor="blue" onClick={onOpenCreateCampaignModal}>
                Create campaign
              </Button>
            </EmptyState>
          </BottomCard>
        </Stack>
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
              'Send up to four variants of a single message, testing text or images to determine which perform best.',
            onSelect: handleABTestCampaign,
            showButton: false,
          },
        ]}
      />
    </ContentWrapper>
  );
};
