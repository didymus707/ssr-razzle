import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../root';
import { HomeComponent } from './home.component';
import { HomeProps } from './home.types';

export const connector = connect((state: RootState) => ({
  user: state.auth.user,
  teams: state.teams.teams,
  tables: state.lists.lists_by_id,
}));

export function HomeContainer(props: HomeProps) {
  return <HomeComponent {...props} />;
}

export const Home = connector(HomeContainer);
