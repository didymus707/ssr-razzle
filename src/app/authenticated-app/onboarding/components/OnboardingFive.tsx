import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import { DecorativeCard } from './DecorativeCard';
import { StepActionButtons } from './StepActionButtons';
import { OnboardStepProps } from '../onboarding.types';

export function OnboardingFive({ notNow, nextStep }: OnboardStepProps) {
  return (
    <DecorativeCard>
      <Box textAlign="center">
        <Text color="#f6fafd" fontSize="0.875rem">
          Guide Setup: 3 out of 4
        </Text>
        <Box
          color="#fff"
          fontSize="xl"
          marginTop="1.5rem"
          marginBottom="1.5rem"
        >
          <p>Do you want to plan a SMS campaign?</p>
        </Box>
        <StepActionButtons onCancel={notNow} onConfirm={nextStep} />
      </Box>
    </DecorativeCard>
  );
}
