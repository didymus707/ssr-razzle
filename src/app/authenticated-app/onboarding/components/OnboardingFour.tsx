import { Box, Flex, Text } from '@chakra-ui/core';
import { fetchCredentials, getIntegrationUrl } from 'app/authenticated-app/channels';
import { selectOrganisationID } from 'app/unauthenticated-app/authentication';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'root';
import { OnboardStepProps } from '../onboarding.types';
import { SkipButton } from './SkipButton';
import { CommunicationFeature, StackContainer } from './StackContainer';

export function OnboardingFour({ nextStep, user, profile }: OnboardStepProps) {
  const organisation_id = useSelector(selectOrganisationID);
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: { channels: simpuSupportedChannels = [] } = {} } = useQuery(
    'simpu-supported-channels',
    fetchCredentials,
  );

  let obj = {} as { [key: string]: any };

  for (const iterator of simpuSupportedChannels) {
    //@ts-ignore
    obj[iterator.name] = iterator;
  }

  const handleButtonClick = () => {
    window.open(
      getIntegrationUrl({
        key: 'messenger',
        token: token || '',
        channel: obj['messenger'].uuid,
        organisation_id: organisation_id || '',
      }),
      '_blank',
    );
  };

  return (
    <Box>
      <Box padding="1.5rem" roundedTopLeft="5px" roundedTopRight="5px" backgroundColor="#2034c5">
        <Flex justifyContent="flex-end">
          <SkipButton onClick={nextStep} />
        </Flex>
        <Box textAlign="center" maxWidth="410px" margin="auto">
          <Text color="#fff" fontSize="0.9rem" lineHeight="1.4rem" fontWeight="medium">
            You can talk to your contacts or clients in conversations. All you simply need to do is
            connect any of these social accounts.
          </Text>
        </Box>
      </Box>
      <Box
        boxShadow="md"
        background="#fff"
        paddingBottom="0.1rem"
        roundedBottomLeft="5px"
        roundedBottomRight="5px"
      >
        <StackContainer>
          <CommunicationFeature
            userId={user?.id}
            email={user?.email}
            channel="messenger"
            name="messenger"
            title="Facebook Messenger"
            onClick={handleButtonClick}
            btnTitle="Connect Facebook Messenger"
            organisation_id={profile?.organisation_id}
            description="Reply customers reaching out to you on Facebook Messenger directly from Simpu"
          />
        </StackContainer>
      </Box>
    </Box>
  );
}
