import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { FullPageSpinner } from './app/components';
import { AcceptTeamInvite } from './app/unauthenticated-app/team/';
import { TermsConditions } from './app/unauthenticated-app/terms-conditions';
import { VerifyEmailPage } from './app/unauthenticated-app/verify';

const loadAuthenticatedApp = () => import('./app/authenticated-app');
const AuthenticatedApp = React.lazy(loadAuthenticatedApp);
const UnauthenticatedApp = React.lazy(() => import('./app/unauthenticated-app'));

const App = () => {
  React.useEffect(() => {
    loadAuthenticatedApp();
  }, []);

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return <Redirect to="/s/home" />;
          }}
        />
        <Route path="/s" render={routeProps => <AuthenticatedApp {...routeProps} />} />
        <Route
          path="/team/invite/:email/:token/:team_id/:teamName"
          render={routeProps => <AcceptTeamInvite {...routeProps} />}
        />
        <Route
          path="/terms-conditions"
          render={routeProps => <TermsConditions {...routeProps} />}
        />
        <Route path="/verify/:token" render={routeProps => <VerifyEmailPage {...routeProps} />} />
        <UnauthenticatedApp />
      </Switch>
    </React.Suspense>
  );
};

export default App;
