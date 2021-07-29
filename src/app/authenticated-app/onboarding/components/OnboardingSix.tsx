import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import { DecorativeCard } from './DecorativeCard';
import { StepActionButtons } from './StepActionButtons';
import { OnboardStepProps } from '../onboarding.types';

export function OnboardingSix({ notNow, nextStep }: OnboardStepProps) {
  return (
    <DecorativeCard>
      <Box>
        <Box textAlign="center">
          <Text color="#f6fafd" fontSize="0.875rem">
            Guide Setup: 4 out of 4
          </Text>
          <Box
            color="#fff"
            fontSize="xl"
            marginTop="1.5rem"
            marginBottom="1.5rem"
          >
            <p>Do you want to invite your team to join you here on Simpu?</p>
          </Box>
          <StepActionButtons onConfirm={nextStep} onCancel={notNow} />
        </Box>
      </Box>
    </DecorativeCard>
  );
}
