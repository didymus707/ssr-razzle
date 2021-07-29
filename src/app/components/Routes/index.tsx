import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

type Props = { isLoggedIn?: boolean } & RouteProps;

export const AuthRoute = ({ isLoggedIn, ...rest }: Props) => {
  return isLoggedIn ? <Redirect to="/s/home" /> : <Route {...rest} />;
};

export function ProtectedRoute({ isLoggedIn, ...rest }: Props) {
  return isLoggedIn ? <Route {...rest} /> : <Redirect to="/login" />;
}
