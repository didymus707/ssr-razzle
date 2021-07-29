import { useToast } from '@chakra-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../../../hooks';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import { FullPageSpinner, ToastBox } from '../../../components';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';
import { CampaignData } from './campaigns.types';
import { CampaignPayload, Planner, TestPlanner } from './components';
import { plannerConnector } from './planner.connector';
import { PlannerProps } from './planner.types';

const ViewCampaignUI = (props: PlannerProps) => {
  const { history, campaign, fetchTemplate, fetchCampaign, updateCampaign, fetchWallet } = props;

  const toast = useToast();
  const { dispatch, globalLoading, loading } = useLoading();
  const { id: routeID } = useParams<{ id: CampaignData['id'] }>();
  const organisation_id = useSelector(selectOrganisationID);

  React.useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      try {
        dispatch({ type: 'GLOBAL_LOADING_STARTED' });
        const { campaign } = await fetchCampaign(routeID);
        if (campaign.template_id) {
          fetchTemplate(campaign.template_id);
        }
        // Ignore if we started fetching something else
        if (!didCancel) {
          dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
        }
      } catch (error) {
        dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [dispatch, fetchCampaign, routeID, fetchTemplate]);

  const handleEditCampaign = async (payload: Partial<CampaignPayload>) => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await updateCampaign(payload);
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Campaign updated successfully" />
        ),
      });
      organisation_id && (await fetchWallet(organisation_id));
      sendAmplitudeData('campaignUpdated', { data: payload });
      history.push('/s/marketing/campaigns');
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  return globalLoading === 'pending' ? (
    <FullPageSpinner bg="white" height="100vh" />
  ) : !!campaign.contents ? (
    <TestPlanner {...props} isSaving={loading === 'pending'} addCampaign={handleEditCampaign} />
  ) : (
    <Planner {...props} isSaving={loading === 'pending'} addCampaign={handleEditCampaign} />
  );
};

export const ViewCampaign = plannerConnector(ViewCampaignUI);
