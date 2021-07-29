import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLoading } from '../../../../../hooks';
import { getZonedTime } from '../../../../../utils';
import { ConfirmModal, EmptyState, FullPageSpinner, ToastBox, Button, Input } from 'app/components';
import { SettingsProps } from '../../settings.container';
import { Team, TeamInvite, TeamMember } from '../../settings.types';
import { AddMemberModal } from './AddMemberModal';
import { InviteMemberModal } from './InviteMemberModal';
import noPeople from '../../assets/no-people.svg';

type Props = Pick<
  SettingsProps,
  | 'team'
  | 'fetchTeamMembers'
  | 'createTeamMember'
  | 'onInviteTeamMembers'
  | 'organisationMembers'
  | 'deleteMemberInvite'
  | 'deleteTeamMember'
> &
  RouteComponentProps<{ id: string }>;

export function TeamMates(props: Props) {
  const {
    team,
    match,
    createTeamMember,
    fetchTeamMembers,
    onInviteTeamMembers,
    organisationMembers,
    deleteMemberInvite,
    deleteTeamMember,
  } = props;
  const [members, setMembers] = React.useState<Team['members']>([]);
  const [invites, setInvites] = React.useState<Team['invites']>([]);
  const [inviteToDelete, setInviteToDelete] = React.useState<TeamInvite | null>(null);
  const [memberToDelete, setMemberToDelete] = React.useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: addMemberModalIsOpen,
    onOpen: onOpenAddMemberModal,
    onClose: onCloseAddMemberModal,
  } = useDisclosure();
  const { dispatch, loading, globalLoading } = useLoading();
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : process.env.REACT_APP_DEMO_URL;

  React.useEffect(() => {
    handleFetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setMembers(team.members);
    setInvites(team.invites?.filter(i => i.status === 'sent'));
  }, [team]);

  const handleFetchTeamMembers = async () => {
    try {
      dispatch({ type: 'GLOBAL_LOADING_STARTED' });
      await fetchTeamMembers(match.params.id);
      dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
    } catch (error) {
      dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleMemberInvite = async (email: string, callback: () => void) => {
    try {
      const payload = {
        email,
        team_id: team.id,
        link: `${BASE_URL}team/invite/{{email}}/{{token}}/{{team_id}}/{{teamName}}`,
      };
      dispatch({ type: 'LOADING_STARTED' });
      await onInviteTeamMembers(payload);
      dispatch({ type: 'LOADING_RESOLVED' });
      callback();
      onClose();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="info" onClose={onClose} message={`Invite sent to ${email}`} />
        ),
      });
      handleFetchTeamMembers();
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleDeleteMemberInvite = async () => {
    dispatch({ type: 'LOADING_STARTED' });
    try {
      const payload = {
        team_id: team?.['id'],
        inviteID: inviteToDelete?.['id'],
      };
      // @ts-ignore
      await deleteMemberInvite(payload);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Invite deleted successfully" />
        ),
      });
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
    dispatch({ type: 'LOADING_RESOLVED' });
    setInviteToDelete(null);
  };

  const handleAddMember = async (ids: TeamMember['id'][]) => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await createTeamMember({ team_id: team?.id, user_ids: ids });
      // await fet
      dispatch({ type: 'LOADING_RESOLVED' });
      onCloseAddMemberModal();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Member added" />
        ),
      });
      handleFetchTeamMembers();
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleRemoveMember = async () => {
    dispatch({ type: 'LOADING_STARTED' });
    try {
      const payload = {
        team_id: team?.['id'],
        memberID: memberToDelete?.['id'],
      };
      // @ts-ignore
      await deleteTeamMember(payload);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Team member removed successfully" />
        ),
      });
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
    dispatch({ type: 'LOADING_RESOLVED' });
    setMemberToDelete(null);
  };

  const member_rows = members?.filter((i: any) =>
    `${i.first_name} ${i.last_name}`.includes(searchQuery),
  );

  const invite_rows = invites?.filter((i: any) => `${i.email}`.includes(searchQuery));

  return (
    <Box maxW="900px" margin="auto">
      <Button
        size="sm"
        variant="outline"
        leftIcon="chevron-left"
        onClick={() => props.history.push('/s/settings/organization/teams')}
      >
        Back
      </Button>
      {globalLoading === 'pending' ? (
        <FullPageSpinner />
      ) : (
        <Box height="100vh" marginY="2rem" overflowY="auto">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            marginBottom="2.5rem"
          >
            <Stack isInline spacing={4} alignItems="center">
              <Text color="#333333" fontWeight={600} fontSize="0.875rem">
                {team.name}
              </Text>
            </Stack>

            <Stack
              isInline
              flexWrap="wrap"
              alignItems="center"
              spacing={['0', '0.5rem', '0.5rem', '0.5rem']}
            >
              <Box>
                <Input
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  placeholder="Search teammates"
                  marginBottom={['0.5rem', '0', '0', '0']}
                  width="200px"
                  size="sm"
                />
              </Box>

              <Button
                size="sm"
                variantColor="blue"
                onClick={onOpenAddMemberModal}
                marginBottom={['0.5rem', '0', '0', '0']}
                width={['100%', 'auto', 'auto', 'auto']}
              >
                Add to team
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onOpen}
                variantColor="blue"
                marginBottom={['0.5rem', '0', '0', '0']}
                width={['100%', 'auto', 'auto', 'auto']}
              >
                Invite member
              </Button>
            </Stack>
          </Box>

          {member_rows?.length === 0 && invite_rows?.length === 0 && (
            <EmptyState
              height="50vh"
              // heading="No one is here"
              subheading="No one is here"
              image={noPeople}
              subheadingProps={{ marginTop: '15px', fontWeight: '500' }}
            />
          )}
          {!!invite_rows?.length &&
            invite_rows.map((item, index) => (
              <Box key={index}>
                <Stack isInline alignItems="center">
                  <Avatar size="sm" color="white" background={team.color} name={`${item.email}`} />
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    <Text color="#333333" fontWeight="normal" fontSize="0.875rem">
                      {item.email}
                    </Text>
                    <Flex alignItems="center">
                      <Text color="#747aa5" fontWeight="normal" fontSize="0.875rem">
                        {getZonedTime(item.created_datetime, 'dd MMM yyyy')}
                      </Text>
                      <Badge ml="20px" variantColor="orange">
                        pending
                      </Badge>
                      <IconButton
                        // @ts-ignore
                        size="50px"
                        backgroundColor="white"
                        aria-label="Delete Invite"
                        // @ts-ignore
                        icon="trash"
                        marginLeft="20px"
                        color="#FE3636"
                        onClick={() => setInviteToDelete(item)}
                      />
                    </Flex>
                  </Box>
                </Stack>
                <Divider margin="0.8rem 0" />
              </Box>
            ))}

          {member_rows?.map((item: any, index) => (
            <Box key={index}>
              <Stack isInline alignItems="center">
                <Avatar
                  size="sm"
                  color="white"
                  background={team.color}
                  name={`${item.first_name} ${item.last_name}`}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color="#333333" fontWeight="normal" fontSize="0.875rem">
                    {`${item.first_name} ${item.last_name}`}
                  </Text>
                  <Flex alignItems="center">
                    <IconButton
                      // @ts-ignore
                      size="sm"
                      variant="ghost"
                      variantColor="red"
                      aria-label="Remove Member"
                      // @ts-ignore
                      icon="trash"
                      marginLeft="20px"
                      onClick={() => setMemberToDelete(item)}
                    />
                  </Flex>
                </Box>
              </Stack>
              <Divider margin="0.8rem 0" />
            </Box>
          ))}
        </Box>
      )}

      <InviteMemberModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleMemberInvite}
        isLoading={loading === 'pending'}
      />
      <AddMemberModal
        data={organisationMembers}
        onSubmit={handleAddMember}
        isOpen={addMemberModalIsOpen}
        onClose={onCloseAddMemberModal}
        isLoading={loading === 'pending'}
      />
      <ConfirmModal
        title={`Delete invite (${inviteToDelete?.email})`}
        isOpen={!!inviteToDelete}
        onConfirm={handleDeleteMemberInvite}
        isLoading={loading === 'pending'}
        onClose={() => setInviteToDelete(null)}
      />
      <ConfirmModal
        title={`Remove member (${memberToDelete?.first_name} ${memberToDelete?.last_name})`}
        isOpen={!!memberToDelete}
        onConfirm={handleRemoveMember}
        isLoading={loading === 'pending'}
        onClose={() => setMemberToDelete(null)}
      />
    </Box>
  );
}
