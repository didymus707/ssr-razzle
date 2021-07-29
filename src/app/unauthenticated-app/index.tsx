import * as React from 'react';
import { AuthRoute } from '../components';
import * as AuthPages from './authentication';

export default function UnauthenticatedApp() {
  return (
    <>
      <AuthRoute path="/login" render={(props: any) => <AuthPages.LoginContainer {...props} />} />
      <AuthRoute
        path="/register"
        render={(props: any) => <AuthPages.RegisterContainer {...props} />}
      />
      <AuthRoute
        path="/forgot-password"
        render={(props: any) => <AuthPages.ForgotPasswordContainer {...props} />}
      />
      <AuthRoute
        path="/reset-password/:id"
        render={(props: any) => <AuthPages.ResetPasswordContainer {...props} />}
      />
    </>
  );
}
