import { Box, Flex, Text } from '@chakra-ui/core';
import { Button } from 'app/components';
import React from 'react';
import { OnboardStepProps } from '../onboarding.types';
import { SkipButton } from './SkipButton';

export function FinalOnboarding({ notNow, history }: OnboardStepProps) {
  return (
    <>
      <Box
        padding="1.5rem"
        background="#6554c0"
        roundedTopLeft="5px"
        roundedTopRight="5px"
        backgroundColor="#2034c5"
      >
        <Flex justifyContent="flex-end">
          <SkipButton onClick={notNow} />
        </Flex>
        <Box textAlign="center" width="410px" margin="auto">
          <Text fontSize="0.875rem" color="#f6fafd" fontWeight="medium">
            Invite your teammates to join you here in Simpu and like they say, the more, the
            merrier!
          </Text>
        </Box>
      </Box>
      <Box
        boxShadow="md"
        padding="1.5rem"
        background="#fff"
        roundedBottomLeft="5px"
        roundedBottomRight="5px"
      >
        <Box maxW="410px" margin="auto" marginTop="0.7rem">
          <Text textAlign="center" fontWeight="semibold" color="#212242">
            Create a team and invite team members
          </Text>
          <Button
            size="sm"
            margin="1rem 0"
            variantColor="blue"
            width={['100%', '100%', '35%', '35%']}
            onClick={() => history?.push('/s/settings/organization/teams')}
          >
            Create team
          </Button>
        </Box>
      </Box>
    </>
  );
}
