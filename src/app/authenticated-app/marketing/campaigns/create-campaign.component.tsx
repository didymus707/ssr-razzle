import { useToast } from '@chakra-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLoading } from '../../../../hooks';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import { ToastBox } from '../../../components';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';
import { CampaignPayload, Planner, TestPlanner } from './components';
import { plannerConnector } from './planner.connector';
import { PlannerProps } from './planner.types';

const CreateCampaignUI = (props: PlannerProps) => {
  const { addCampaign, history, fetchWallet, match } = props;

  const { type: campaignType } = match.params;

  const toast = useToast();
  const { loading, dispatch } = useLoading();
  const organisation_id = useSelector(selectOrganisationID);

  const handleCreateCampaign = async (payload: Partial<CampaignPayload>) => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await addCampaign(payload);
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Campaign created successfully" />
        ),
      });
      organisation_id && (await fetchWallet(organisation_id));
      sendAmplitudeData('campaignCreated', { data: payload });
      history.push('/s/marketing/campaigns');
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  return campaignType === 'one-time-campaign' ? (
    <Planner
      {...props}
      campaign={{}}
      isSaving={loading === 'pending'}
      addCampaign={handleCreateCampaign}
    />
  ) : (
    <TestPlanner
      {...props}
      campaign={{}}
      isSaving={loading === 'pending'}
      addCampaign={handleCreateCampaign}
    />
  );
};

export const CreateCampaign = plannerConnector(CreateCampaignUI);
