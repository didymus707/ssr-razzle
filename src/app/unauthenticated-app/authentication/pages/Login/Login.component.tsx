import * as React from 'react';
import { Text } from '@chakra-ui/core/dist';
import { LoginForm, LoginFormInitialValuesProps } from '../../components/forms';
import { AuthLayout } from '../../components/layout';
import { AuthProps } from '../../types';
// import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function LoginComponent(props: AuthProps<LoginFormInitialValuesProps>) {
  const { onSubmit, isLoading } = props;

  useEffect(() => {
    document.title = 'Simpu: Login';
  }, []);

  return (
    <AuthLayout
      heading="Sign in to your account"
      footing={
        <Text>
          Don't have an account? We'll be out of private beta soon{' '}
          <span role="img" aria-label="smiley">
            😊
          </span>
          {/*<Link style={{ color: '#2034c5' }} to="/register">*/}
          {/*  Sign up*/}
          {/*</Link>*/}
        </Text>
      }
    >
      <LoginForm isLoading={isLoading} onSubmit={values => onSubmit(values)} />
    </AuthLayout>
  );
}
