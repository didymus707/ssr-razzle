import { Box, Heading, Stack, useToast } from '@chakra-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SettingsProps } from '../../settings.container';
import { ChangePassordForm } from './ChangePasswordForm';
import { ProfileForm } from './ProfileForm';
import { ToastBox } from '../../../../components';
import { UserProfile } from '../../../../unauthenticated-app/authentication';
import { useLoading } from '../../../../../hooks';
import { Avatar } from '@chakra-ui/core/dist';

export function Profile(
  props: Pick<SettingsProps, 'user' | 'profile' | 'editProfile' | 'editPassword'> &
    RouteComponentProps,
) {
  const toast = useToast();
  const { dispatch, tableLoading: profileLoading, loading: changePasswordLoading } = useLoading();
  const { user, profile, editProfile, editPassword } = props;

  const handleProfileUpdate = async (values: Pick<UserProfile, 'first_name' | 'last_name'>) => {
    dispatch({ type: 'TABLE_LOADING_STARTED' });
    try {
      await editProfile({
        ...values,
        user_id: user?.id,
        organisation_id: profile?.organisation_id,
      });
      dispatch({ type: 'TABLE_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Profile updated" />
        ),
      });
    } catch (error) {
      dispatch({ type: 'TABLE_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleChangePassword = async (
    values: {
      old_password: string;
      new_password: string;
    },
    callback: () => void,
  ) => {
    dispatch({ type: 'LOADING_STARTED' });
    try {
      await editPassword(values);
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Password changed" />
        ),
      });
      callback();
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    }
  };

  return (
    <Box maxW="900px" margin="auto" paddingBottom={['5rem', '10rem', '0']}>
      <Box
        marginBottom="1.5rem"
        paddingBottom="2.5rem"
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      >
        <Stack isInline alignItems="center">
          <Heading fontWeight="semibold" size="sm" color="#333333">
            My Settings
          </Heading>
        </Stack>

        <Box marginTop="2rem">
          <Avatar size="2xl" name={`${profile?.first_name} ${profile?.last_name}`} />
        </Box>

        <Box marginTop="2rem">
          <ProfileForm
            onSubmit={handleProfileUpdate}
            initialValues={{
              email: user?.email,
              last_name: profile?.last_name,
              first_name: profile?.first_name,
            }}
            isLoading={profileLoading === 'pending'}
          />
        </Box>
      </Box>
      <Box marginBottom="1.5rem" paddingBottom="1.5rem">
        <Stack isInline alignItems="center">
          <Heading fontWeight="semibold" size="sm" color="#333333">
            Change Password
          </Heading>
        </Stack>
        <Box marginTop="1.5rem">
          <ChangePassordForm
            onSubmit={handleChangePassword}
            isLoading={changePasswordLoading === 'pending'}
          />
        </Box>
      </Box>
    </Box>
  );
}
