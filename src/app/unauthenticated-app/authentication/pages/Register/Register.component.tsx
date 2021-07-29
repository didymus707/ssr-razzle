import * as React from 'react';
import { RegisterForm, RegisterFormInitialValuesProps } from '../../components/forms';
import { AuthLayout } from '../../components/layout';
import { AuthProps } from '../../types';
import { Link } from 'react-router-dom';
import { Text } from '@chakra-ui/core/dist';

type Props = AuthProps<RegisterFormInitialValuesProps> & { showOrganizationName?: boolean };

export function RegisterComponent(props: Props) {
  const { onSubmit, isLoading, showOrganizationName } = props;

  return (
    <AuthLayout
      heading="Get started for free"
      footing={
        <Text>
          Already have an account?{' '}
          <Link style={{ color: '#2034c5' }} to="/login">
            Log in here
          </Link>
        </Text>
      }
    >
      <RegisterForm
        isLoading={isLoading}
        onSubmit={values => onSubmit(values)}
        showOrganizationName={showOrganizationName}
      />
    </AuthLayout>
  );
}
