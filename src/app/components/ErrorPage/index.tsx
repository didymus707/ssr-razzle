import { Box, Stack } from '@chakra-ui/core';
import * as React from 'react';
import errorImage from './404.svg';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '../Button';

interface ErrorPageProps {
  history: RouteComponentProps['history'];
}

export const ErrorPage = withRouter(function ErrorPageUI({ history }: ErrorPageProps) {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      backgroundImage="linear-gradient(230deg, rgba(255, 255, 255, 0), #e6eaee)"
    >
      <Box maxWidth="480px" marginBottom="3rem">
        <img alt="error page" src={errorImage} style={{ width: '100%' }} />
      </Box>
      <Stack isInline alignItems="center">
        <Button
          size="sm"
          variantColor="blue"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload this page
        </Button>
        <Button
          size="sm"
          onClick={() => {
            history.push('/s/home');
            window.location.reload();
          }}
        >
          Go to dashboard
        </Button>
      </Stack>
    </Box>
  );
});
