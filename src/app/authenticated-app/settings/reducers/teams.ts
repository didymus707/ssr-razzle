import { teamsSlice } from '../slices';

export const {
  getTeams,
  editTeamItem,
  createTeamItem,
  deleteTeamItem,
  getTeamsMembers,
  getOrganisationMembers,
  getOrganizations,
  removeTeamInvite,
  removeTeamMember,
} = teamsSlice.actions;

export const teamsReducer = teamsSlice.reducer;
