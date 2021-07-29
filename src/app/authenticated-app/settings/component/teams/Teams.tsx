import { Box, Heading, useDisclosure, useToast, Stack } from '@chakra-ui/core';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EmptyState, ToastBox, ConfirmModal, Button, Input } from 'app/components';
import { SettingsProps } from '../../settings.container';
import noTeams from '../../assets/no-teams.svg';
import { Team } from '../../settings.types';
import { TeamModal } from './TeamModal';
import { TeamsList } from './TeamsList';
import { useLoading } from '../../../../../hooks';
import { useSelector } from 'react-redux';
import { selectActiveSubscription } from '../../selectors';
import { useState } from 'react';
import noPeople from '../../assets/no-people.svg';

export const Teams = (
  props: Pick<
    SettingsProps,
    'profile' | 'teams' | 'addTeam' | 'editTeam' | 'removeTeam' | 'openNoSubscriptionModal'
  > &
    RouteComponentProps,
) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {
    teams,
    match,
    profile,
    history,
    addTeam,
    editTeam,
    removeTeam,
    openNoSubscriptionModal,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { dispatch, loading } = useLoading();

  const [teamToEdit, setTeamToEdit] = React.useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = React.useState<Team | null>(null);

  const rows = teams.filter((i: any) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreateTeam = async (values: Pick<Team, 'name' | 'color'>, callback: () => void) => {
    dispatch({ type: 'LOADING_STARTED' });
    try {
      await addTeam({
        ...values,
        organisation_id: profile?.organisation_id,
      });
      dispatch({ type: 'LOADING_RESOLVED' });
      callback();
      onClose();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Team created" />
        ),
      });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleEditTeam = async (values: Team, callback: () => void) => {
    dispatch({ type: 'LOADING_STARTED' });
    try {
      if (teamToEdit) {
        await editTeam(values);
        dispatch({ type: 'LOADING_RESOLVED' });
        callback();
        setTeamToEdit(null);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Team updated" />
          ),
        });
      }
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleDeleteTeam = async () => {
    dispatch({ type: 'LOADING_STARTED' });
    try {
      await removeTeam(teamToDelete?.id);
      dispatch({ type: 'LOADING_RESOLVED' });
      setTeamToDelete(null);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Team deleted" />
        ),
      });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleTeamClick = (id: Team['id']) => {
    history.push(`${match.path}/${id}/members`);
  };

  const active_subscription: any = useSelector(selectActiveSubscription);
  let allow_create: boolean = false;
  if (!active_subscription?.details?.organization?.teams) allow_create = true;
  else if (active_subscription.details.organization.teams > teams.length) allow_create = true;

  return (
    <Box maxW="900px" margin="auto">
      <Stack isInline alignItems="center" marginBottom="1.5rem" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Heading size="sm" color="#333333" fontWeight="semibold">
            Manage Teams
          </Heading>
          <Box fontWeight="400" color="#757575" fontSize="14px">
            - {teams.length} team(s)
          </Box>
        </Box>

        <Button
          variant="solid"
          variantColor="blue"
          size="sm"
          fontWeight="500"
          onClick={() => {
            if (allow_create) onOpen();
            else {
              openNoSubscriptionModal({
                heading: "Oops, looks like you've run out of available teams on your organization",
                subHeading: `Upgrade to our business plan to create unlimited teams in this organization. This organization is currently capped at a maximum of ${active_subscription.details.organization.teams} teams`,
              });
            }
          }}
        >
          Create Team
        </Button>
      </Stack>

      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Input
          placeholder="Search by name"
          size="sm"
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          width="400px"
          autoFocus
        />
      </Box>

      {!!teams.length ? (
        <Box marginTop="15px">
          <Box paddingBottom="1rem">
            <TeamsList
              teams={rows}
              onClick={handleTeamClick}
              onEditTeam={setTeamToEdit}
              onDeleteTeam={setTeamToDelete}
            />

            {rows.length === 0 && (
              <EmptyState
                marginY="10vh"
                image={noPeople}
                subheading="No teams found in your search"
                subheadingProps={{ marginTop: '25px', fontWeight: '500' }}
              />
            )}
          </Box>
        </Box>
      ) : (
        <EmptyState
          margin="auto"
          height="calc(100vh - 200px)"
          width="500px"
          image={noTeams}
          heading="No teams created"
          subheading="Many separate teams can exist within one account. A team is a
        distinct workspace. Users can belong to single or multiple teams."
        >
          <Button size="sm" onClick={onOpen} variantColor="blue">
            Create a team
          </Button>
        </EmptyState>
      )}

      <TeamModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateTeam}
        isLoading={loading === 'pending'}
      />

      <TeamModal
        title="Edit team"
        isOpen={!!teamToEdit}
        onSubmit={handleEditTeam}
        initialValues={teamToEdit}
        isLoading={loading === 'pending'}
        onClose={() => setTeamToEdit(null)}
      />

      <ConfirmModal
        title="Delete team"
        isOpen={!!teamToDelete}
        onConfirm={handleDeleteTeam}
        isLoading={loading === 'pending'}
        onClose={() => setTeamToDelete(null)}
      />
    </Box>
  );
};
