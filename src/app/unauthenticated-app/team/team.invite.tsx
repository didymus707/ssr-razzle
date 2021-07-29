import { Box, useToast } from '@chakra-ui/core';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLoading } from '../../../hooks';
import { loadState, saveState } from '../../../utils';
import { sendAmplitudeData } from '../../../utils/amplitude';
import { acceptTeamInvite } from '../../authenticated-app/settings';
import { ToastBox, Button } from '../../components';
import Logo from '../../components/Logo';
import shapeTwo from './shape-2.svg';
import shapeOne from './shape.svg';
import { TeamInvitePageContainer } from './team.style';

export const AcceptTeamInvite = (
  props: RouteComponentProps<{
    email: string;
    token: string;
    team_id: string;
    teamName: string;
  }>,
) => {
  const { match, history } = props;
  const { email, token, team_id, teamName } = match.params;

  const toast = useToast();
  const { dispatch, loading } = useLoading();

  const handleAcceptTeamInvite = async () => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      const response = await acceptTeamInvite({ email, token, team_id });
      dispatch({ type: 'LOADING_RESOLVED' });
      const { redirect } = response.data;
      sendAmplitudeData('teamInviteAccepted');

      if (redirect) {
        if (!isEmpty(loadState())) {
          saveState({ ...loadState(), inviteToken: token, team_id });
        } else {
          saveState({ inviteToken: token, team_id });
        }
        history.push('/register?redirect=true');
      } else {
        history.push('/login');
      }
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  return (
    <TeamInvitePageContainer>
      <div className="main__header">
        <div>
          <span>
            <img src={shapeOne} alt="" />
          </span>
          <span>
            <img src={shapeTwo} alt="" />
          </span>
        </div>
        <section id="subscription__intro">
          <div className="subscription__intro__bg__wrapper">
            <div className="subscription__intro__wrapper">
              <Box marginBottom="1.5rem">
                <Logo width="150px" />
              </Box>
              <h1>All -in-one place to run your entire business.</h1>
              <div className="other-text">
                <p>
                  You've been invited to join team{' '}
                  {decodeURIComponent(teamName.replace(/\+/g, '%20'))} on Simpu
                </p>
              </div>
              <Button
                variantColor="blue"
                loadingText="Accepting invite"
                onClick={handleAcceptTeamInvite}
                isLoading={loading === 'pending'}
              >
                Accept invitation
              </Button>
            </div>
          </div>
        </section>
      </div>
    </TeamInvitePageContainer>
  );
};
