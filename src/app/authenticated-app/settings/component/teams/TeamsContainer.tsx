import * as React from 'react';
import { SettingsProps } from '../../settings.container';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { Teams } from './Teams';
import { TeamMates } from './Teamates';

type Props = Pick<
  SettingsProps,
  | 'team'
  | 'teams'
  | 'profile'
  | 'addTeam'
  | 'editTeam'
  | 'removeTeam'
  | 'createTeamMember'
  | 'deleteMemberInvite'
  | 'deleteTeamMember'
  | 'fetchTeamMembers'
  | 'onInviteTeamMembers'
  | 'organisationMembers'
  | 'openNoSubscriptionModal'
> &
  RouteComponentProps;

export const TeamsContainer = (props: Props) => {
  const {
    team,
    match,
    teams,
    profile,
    addTeam,
    editTeam,
    removeTeam,
    createTeamMember,
    fetchTeamMembers,
    onInviteTeamMembers,
    organisationMembers,
    deleteMemberInvite,
    deleteTeamMember,
    openNoSubscriptionModal,
  } = props;

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}`}
        render={routeProps => (
          <Teams
            {...{
              teams,
              profile,
              addTeam,
              editTeam,
              removeTeam,
              openNoSubscriptionModal,
              ...routeProps,
            }}
          />
        )}
      />
      <Route
        path={`${match.path}/:id/members`}
        render={routeProps => (
          <TeamMates
            {...{
              team,
              fetchTeamMembers,
              createTeamMember,
              onInviteTeamMembers,
              organisationMembers,
              deleteMemberInvite,
              deleteTeamMember,
              ...routeProps,
            }}
          />
        )}
      />
    </Switch>
  );
};
