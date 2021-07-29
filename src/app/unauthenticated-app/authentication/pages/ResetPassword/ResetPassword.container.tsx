import { useToast } from '@chakra-ui/core';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { sendAmplitudeData } from '../../../../../utils/amplitude';
import { ToastBox } from '../../../../components';
import { ResetPasswordFormInitialValuesProps } from '../../components';
import { resetPassword } from '../../service';
import { ResetPassword } from './ResetPassword.component';

export function ResetPasswordContainer(props: RouteComponentProps<{ id: string }>) {
  const toast = useToast();
  const { match, history } = props;
  const token = match.params.id;
  const [loading, setLoading] = React.useState(false);

  async function handleResetPassword(values: ResetPasswordFormInitialValuesProps) {
    const { newPassword } = values;
    try {
      setLoading(true);
      await resetPassword({ password: newPassword, token });
      setLoading(false);
      sendAmplitudeData('resetPasswordComplete');
      history.push('/login');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} status="success" message="Password reset successful" />
        ),
      });
    } catch (error) {
      setLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }
  return <ResetPassword {...props} isLoading={loading} onSubmit={handleResetPassword} />;
}
