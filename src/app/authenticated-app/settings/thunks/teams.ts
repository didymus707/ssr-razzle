import { UserProfile } from '../../../unauthenticated-app/authentication/service';
import { AppThunk } from '../../../../root';
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  inviteTeamMembers,
  listTeams,
  organisationMembers,
  organizationList,
  teamMemberList,
  updateTeam,
} from '../settings.service';
import { sortTeamsFunc } from '../settings.utils';
import {
  createTeamItem,
  deleteTeamItem,
  editTeamItem,
  getOrganisationMembers,
  getOrganizations,
  getTeams,
  getTeamsMembers,
  removeTeamInvite,
  removeTeamMember,
} from '../settings.reducers';
import { Team, TeamInvite, TeamMember } from '../settings.types';
import { client } from '../../../../utils';

export const fetchTeams = (
  organisation_id: UserProfile['organisation_id'],
): AppThunk => async dispatch => {
  const response = await listTeams(organisation_id);
  const { teams } = response.data;
  /**
   * sort teams based on created datetime
   * this sort should come from API actually
   */
  const sortedTeams = teams.sort(sortTeamsFunc);
  dispatch(getTeams({ teams: sortedTeams }));
  return response.data;
};

export const addTeam = (
  payload: Pick<Team, 'name' | 'color'> & {
    organisation_id?: UserProfile['organisation_id'];
  },
): AppThunk => async dispatch => {
  const response = await createTeam(payload);
  const { team } = response.data;
  dispatch(createTeamItem({ team }));
  return response.data;
};

export const editTeam = (payload: Team): AppThunk => async dispatch => {
  const response = await updateTeam(payload);
  const { team } = response.data;
  dispatch(editTeamItem({ team }));
  return response.data;
};

export const removeTeam = (payload: Team['id']): AppThunk => async dispatch => {
  const response = await deleteTeam(payload);
  dispatch(deleteTeamItem({ id: payload }));
  return response;
};

export const fetchTeamMembers = (id: Team['id']): AppThunk => async dispatch => {
  const response = await teamMemberList(id);
  const { team } = response.data;
  dispatch(getTeamsMembers({ team }));
  return response.data;
};

export const onInviteTeamMembers = (payload: {
  link: string;
  email: string;
  team_id: Team['id'];
}): AppThunk => async () => {
  const response = await inviteTeamMembers(payload);
  return response.data;
};

export const fetchOrganisationMembers = (
  id: UserProfile['organisation_id'],
): AppThunk => async dispatch => {
  const response = await organisationMembers(id);
  const { members } = response.data;
  dispatch(getOrganisationMembers({ organisationMembers: members }));
  return response.data;
};

export const fetchOrganizations = (): AppThunk => async dispatch => {
  const response = await organizationList();
  const { organisations: organizations } = response.data;
  dispatch(getOrganizations({ organizations }));
  return response.data;
};

export const createTeamMember = (payload: {
  team_id: Team['id'];
  user_ids: string[];
}): AppThunk => async (dispatch, getState) => {
  const {
    auth: { profile },
  } = getState();

  const client_calls = payload.user_ids.map((i: string) =>
    addTeamMember({
      team_id: payload.team_id,
      user_id: i,
    }),
  );
  try {
    const response = await Promise.all(client_calls);
    profile && dispatch(fetchTeams(profile.organisation_id));
    return response;
  } catch (e) {
    return null;
  }
};

export const deleteMemberInvite = (payload: {
  inviteID: TeamInvite['id'];
  team_id: Team['id'];
}): AppThunk => async dispatch => {
  await client(`teams/${payload.team_id}/invite`, {
    method: 'DELETE',
    data: {
      id: payload.inviteID,
    },
  });
  dispatch(removeTeamInvite({ inviteID: payload.inviteID }));
};

export const deleteTeamMember = (payload: {
  memberID: TeamMember['id'];
  team_id: Team['id'];
}): AppThunk => async (dispatch, getState) => {
  const {
    auth: { profile },
  } = getState();

  await client(`teams/${payload.team_id}/members`, {
    method: 'DELETE',
    data: {
      id: payload.memberID,
    },
  });
  profile && dispatch(fetchTeams(profile.organisation_id));
  dispatch(removeTeamMember({ memberID: payload.memberID }));
};
