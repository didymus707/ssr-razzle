import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';
import { Organization } from '../../../unauthenticated-app/authentication/service';
import { Team, TeamInvite, TeamMember, TeamsState } from '../settings.types';

const teamsInitialState = {
  teams: [],
  team: {} as Team,
  organisationMembers: [],
  organizations: [],
} as TeamsState;

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: teamsInitialState,
  reducers: {
    getTeams(state, action: PayloadAction<{ teams: Team[] }>) {
      const { teams } = action.payload;
      state.teams = teams;
    },
    createTeamItem(state, action: PayloadAction<{ team: Team }>) {
      const { team } = action.payload;
      state.teams?.unshift(team);
    },
    editTeamItem(state, action: PayloadAction<{ team: Team }>) {
      const { team } = action.payload;
      const index = state.teams.findIndex(item => item.id === team.id);
      state.teams[index] = { ...state.teams[index], ...team };
    },
    deleteTeamItem(state, action: PayloadAction<{ id: Team['id'] }>) {
      const { id } = action.payload;
      state.teams = state.teams.filter(item => item.id !== id);
    },
    getTeamsMembers(state, action: PayloadAction<{ team: Team }>) {
      const { team } = action.payload;
      state.team = team;
    },
    removeTeamMember(state, action: PayloadAction<{ memberID: String }>) {
      const { memberID } = action.payload;
      // @ts-ignore
      const members = state.team.members.filter((i): TeamMember => i.id !== memberID);
      state.team = {
        ...state.team,
        members,
      };
    },
    removeTeamInvite(state, action: PayloadAction<{ inviteID: TeamInvite['id'] }>) {
      const { inviteID } = action.payload;
      // @ts-ignore
      const invites = state.team.invites.filter((i): TeamInvite => i.id !== inviteID);
      state.team = {
        ...state.team,
        invites,
      };
    },
    getOrganisationMembers(state, action: PayloadAction<{ organisationMembers: TeamMember[] }>) {
      const { organisationMembers } = action.payload;
      state.organisationMembers = organisationMembers;
    },
    getOrganizations(state, action: PayloadAction<{ organizations: Organization[] }>) {
      const { organizations } = action.payload;
      state.organizations = organizations;
    },
  },
});

export const selectOrgMembers = createSelector(
  (state: RootState) => state.teams,
  teams => teams.organisationMembers,
);

export const selectOrgMemberByID = createSelector(
  selectOrgMembers,
  (_: RootState, memberID: string) => memberID,
  (orgMembers, memberID) => orgMembers.find(({ id }) => memberID === id),
);

export const makeSelectOrgMemberByID = () => selectOrgMemberByID;

export const selectOtherOrgMembers = createSelector(
  selectOrgMembers,
  (_: RootState, payload: { user_id: string }) => payload,
  (orgMembers, { user_id }) => orgMembers.filter(({ id }) => user_id !== id),
);

export const selectTeams = createSelector(
  (state: RootState) => state.teams,
  teams => teams.teams,
);

export const selectOrganisations = createSelector(
  (state: RootState) => state.teams,
  teams => teams.organizations,
);

export const selectOrganisationIDs = createSelector(selectOrganisations, organizations =>
  organizations.map(({ id }) => id),
);
