import { useToast } from '@chakra-ui/core';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Cookie from 'js-cookie';
import { ToastBox } from '../../../../components';
import { LoginFormInitialValuesProps } from '../../components';
import { fetchProfile, login, saveUser } from '../../service';
import { LoginComponent } from './Login.component';
import { sendAmplitudeData, setAmplitudeUserProperties } from '../../../../../utils/amplitude';

const connector = connect(null, { saveUser, fetchProfile });

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = RouteComponentProps & PropsFromRedux;

function Login(props: Props) {
  const { history, saveUser, fetchProfile } = props;
  const toast = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);

  async function handleLogin(values: LoginFormInitialValuesProps) {
    setLoading(true);
    try {
      Cookie.remove('auth_period');
      sessionStorage.removeItem('auth_valid');
      const data = await login(values);
      saveUser(data);
      if (!values.rememberMe) {
        Cookie.set('auth_period', 'session');
        sessionStorage.setItem('auth_valid', 'true');
      }
      const { profile, user } = await fetchProfile(data.organisations[0].id);
      setLoading(false);
      setAmplitudeUserProperties({ ...profile, email: user.email });
      sendAmplitudeData('login');
      history.push('/s/home');
    } catch (error) {
      setLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Sorry, unable to login. Please check your credentials"
          />
        ),
      });
    }
  }

  return <LoginComponent {...props} onSubmit={handleLogin} isLoading={loading} />;
}

export const LoginContainer = connector(Login);
