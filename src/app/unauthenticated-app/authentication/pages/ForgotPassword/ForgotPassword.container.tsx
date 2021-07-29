import { useToast } from '@chakra-ui/core';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ToastBox } from '../../../../components';
import { ForgotPasswordInitialValuesProps } from '../../components';
import { forgotPasswordAsync } from '../../service';
import { ForgotPassword } from './ForgotPassword.component';
import { useEffect } from 'react';
import { sendAmplitudeData } from '../../../../../utils/amplitude';

type PropsWithRedux = ConnectedProps<typeof stateConnector>;
type Props = PropsWithRedux & RouteComponentProps;

const stateConnector = connect(null, {
  forgotPasswordAsync,
});

function ForgotPasswordComponent(props: Props) {
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { forgotPasswordAsync } = props;

  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : process.env.REACT_APP_DEMO_URL;

  async function handleForgotPassword(values: ForgotPasswordInitialValuesProps) {
    try {
      setLoading(true);
      await forgotPasswordAsync({
        ...values,
        link: `${BASE_URL}reset-password/{{token}}`,
      });
      setLoading(false);
      setIsSuccess(true);
      sendAmplitudeData('resetPasswordRequest');
    } catch (error) {
      setLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  useEffect(() => {
    document.title = 'Simpu: Forgot Password';
  }, []);

  return (
    <ForgotPassword
      {...props}
      isLoading={loading}
      isSuccess={isSuccess}
      onSubmit={handleForgotPassword}
      closeAlert={() => setIsSuccess(false)}
    />
  );
}

export const ForgotPasswordContainer = stateConnector(ForgotPasswordComponent);
