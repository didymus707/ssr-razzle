import React, { useState } from 'react';
import { Box, Text, Flex, Spinner } from '@chakra-ui/core';
import { SwitchWithText } from './SwitchWithText';
import { SocialIcon, PayButton, Button } from 'app/components';
import { buildConversationUrl } from '../../../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../root';
import { useHistory, useLocation } from 'react-router-dom';
import { selectProfile, selectUserEmail } from '../../../unauthenticated-app/authentication';

export function Platform() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [isRecurring, setIsRecurring] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const pathNameArray = location.pathname.split('/');
  const which = pathNameArray[pathNameArray.length - 1];
  const whichName = which
    .split('-')
    .map((item: string) => `${item[0].toUpperCase()}${item.substring(1, item.length)}`)
    .join(' ');
  const { organisation_id, first_name, last_name } = useSelector(selectProfile) || {
    organisation_id: '',
    first_name: '',
    last_name: '',
  };
  const email = useSelector(selectUserEmail);

  const connectToChannel = () => {
    setPageLoader(true);

    if (process.env.NODE_ENV === 'development' && which === 'messenger') {
      window.location.href = `http://localhost:5556/api/v1/auth/${which}?token=${token}&organisation_id=${organisation_id}`;

      return;
    }

    window.location.href = buildConversationUrl(
      `auth/${which}?token=${token}&organisation_id=${organisation_id}`,
    );
  };

  const descriptions: { [keys: string]: string } = {
    twitter: 'Handle tweets & DMs directly in Inbox.',
    messenger: 'Connect Messenger directly to Simpu, to receive DMs.',
  };

  return (
    <Box height="100vh" backgroundColor="white">
      {pageLoader ? (
        <Box textAlign="center" paddingTop="2rem">
          <Spinner color="blue.500" size="md" />
        </Box>
      ) : (
        <>
          <Box p="1rem">
            <Button
              size="sm"
              variant="ghost"
              leftIcon="chevron-left"
              onClick={() => history.goBack()}
            >
              Go back to directory
            </Button>
          </Box>
          <Box paddingTop="3.25rem" marginX="auto" maxWidth="20.125rem" color="brandBlack">
            <Text fontSize="1.125rem" fontWeight={600} textAlign="center">
              {`Connect ${whichName}`}
            </Text>

            <SwitchWithText
              left="One Time"
              right="Recurring"
              isRight={isRecurring}
              setIsRight={setIsRecurring}
              fontSize=".875rem"
              marginTop="5.3125rem"
            />

            <Flex
              backgroundColor="rgba(0, 0, 0, 0.03)"
              borderRadius=".3125rem"
              fontSize=".75rem"
              padding="1.25rem 1.5rem"
              marginTop=".625rem"
            >
              <SocialIcon which={which} size="1.5rem" />

              <Box marginLeft=".5rem">
                <Flex alignItems="flex-end">
                  <Text fontSize="1.25rem" fontWeight="bold">
                    $20
                  </Text>
                  <Text color="rgba(17, 17, 17, 0.5)" marginLeft=".3125rem" marginBottom=".25rem">
                    /mo per channel
                  </Text>
                </Flex>

                <Text color="rgba(17, 17, 17, 0.5)" marginTop=".625rem">
                  {descriptions[which]}
                </Text>
              </Box>
            </Flex>

            <PayButton
              variantColor="blue"
              width="100%"
              marginTop="1.25rem"
              fontSize=".865rem"
              email={email || ''}
              amount={759000}
              first_name={first_name}
              last_name={last_name}
              callback={() => connectToChannel()}
            >
              {`Connect ${whichName}`}
            </PayButton>
          </Box>
        </>
      )}
    </Box>
  );
}
