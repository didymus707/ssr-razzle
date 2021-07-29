import { UserProfile } from '../../../unauthenticated-app/authentication/service';
import { client } from '../../../../utils';
import { Team } from '../settings.types';

export const listTeams = (organizationID: UserProfile['organisation_id']) => {
  return client(`teams/${organizationID}`);
};

export const createTeam = (
  payload: Pick<Team, 'name' | 'color'> & {
    organisation_id?: UserProfile['organisation_id'];
  }
) => {
  return client('teams/create', { method: 'POST', data: payload });
};

export const updateTeam = (payload: Team) => {
  return client('teams/update', { method: 'PATCH', data: payload });
};

export const deleteTeam = (id: Team['id']) => {
  return client(`teams/delete`, { method: 'DELETE', data: { id } });
};

export const teamMemberList = (id: Team['id']) => {
  return client(`teams/${id}/members`);
};

export const inviteTeamMembers = (payload: { link: string; email: string; team_id: Team['id'] }) => {
  const { team_id, ...rest } = payload;
  return client(`teams/${team_id}/invite`, { method: 'POST', data: rest });
};

export const acceptTeamInvite = (payload: { email: string; token: string; team_id: Team['id'] }) => {
  return client(`teams/invite/accept`, { method: 'POST', data: payload }, false);
};

export const organisationMembers = (organisation_id: UserProfile['organisation_id']) => {
  return client(`organisations/${organisation_id}/members`);
};

export const organizationList = () => {
  return client(`organisations`);
};

export const addTeamMember = (payload: { team_id: Team['id']; user_id: string }) => {
  const { team_id, user_id } = payload;
  return client(`teams/${team_id}/members/create`, {
    method: 'POST',
    data: { user_id },
  });
};
