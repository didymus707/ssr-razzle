import { useToast } from '@chakra-ui/core';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ToastBox } from '../../../../components';
import { RegisterFormInitialValuesProps } from '../../components';
import { register, saveUser } from '../../service';
import { RegisterComponent } from './Register.component';
import isEmpty from 'lodash/isEmpty';
import { loadState } from '../../../../../utils';
import { useEffect } from 'react';
import { sendAmplitudeData } from '../../../../../utils/amplitude';

const connector = connect(null, { saveUser });

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = RouteComponentProps & PropsFromRedux;

function Register(props: Props) {
  const toast = useToast();
  const { history, saveUser, location } = props;
  const [loading, setLoading] = React.useState(false);

  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : process.env.REACT_APP_DEMO_URL;

  async function handleRegister(values: RegisterFormInitialValuesProps) {
    setLoading(true);
    //TODO: change verify link to app.simpu.co when going live
    let payload = { ...values, link: `${BASE_URL}verify/{{token}}` };
    const localStorageData = loadState();
    // check to see if the person is coming from an invite link
    if (!isEmpty(localStorageData) && localStorageData.team_id && localStorageData.inviteToken) {
      const { team_id, inviteToken } = localStorageData;
      payload = { ...payload, team_id, inviteToken };
    }
    try {
      const data = await register(payload);
      saveUser(data);
      setLoading(false);
      sendAmplitudeData('signup');
      history.push('/s/home');
    } catch (error) {
      setLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  useEffect(() => {
    document.title = 'Simpu: Sign up';
  }, []);

  return (
    <RegisterComponent
      {...props}
      isLoading={loading}
      onSubmit={handleRegister}
      showOrganizationName={!location.search}
    />
  );
}

export const RegisterContainer = connector(Register);
