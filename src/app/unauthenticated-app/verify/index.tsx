import { Box, Flex, Heading, Stack, Text, useToast } from '@chakra-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { loadState } from '../../../utils';
import { sendAmplitudeData } from '../../../utils/amplitude';
import { ToastBox, Button } from '../../components';
import Logo from '../../components/Logo';
import { verifyEmail } from '../authentication';

export const VerifyEmailPage = (
  props: RouteComponentProps<{
    token: string;
  }>,
) => {
  const { match, history } = props;
  const { token } = match.params;

  const toast = useToast();

  const [loading, setLoading] = React.useState(false);

  async function handleVerifyEmail() {
    const isLoggedIn = !isEmpty(loadState()) ? !!loadState().token : false;
    setLoading(true);
    try {
      await verifyEmail({ token });
      setLoading(false);
      sendAmplitudeData('emailVerified');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} status="success" message="Email verified successfully" />
        ),
      });
      isLoggedIn ? history.push('/s/home') : history.push('/login');
    } catch (error) {
      setLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  return (
    <Flex
      px="1rem"
      width="100%"
      height="100vh"
      position="fixed"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      backgroundColor="#f5f5f5"
    >
      <Stack
        px="1rem"
        py="1.5rem"
        mb="1.5rem"
        rounded="5px"
        spacing="1.2rem"
        maxWidth="800px"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
      >
        <Box>
          <Logo width="150px" />
        </Box>
        <Heading textAlign="center">Verify your email address</Heading>
        <Text width={['100%', '80%', '80%']} mx="auto" textAlign="center" color="gray.500">
          Please confirm that you want to use this as your Simpu account email address. Once it is
          done you can start using Simpu!
        </Text>
        <Button size="lg" variantColor="blue" isLoading={loading} onClick={handleVerifyEmail}>
          Verify my email
        </Button>
      </Stack>
      <Box>
        <Text color="gray.500" textAlign="center">
          &copy;2020 Simpu. All rights reserved
        </Text>
      </Box>
    </Flex>
  );
};
