import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import { DecorativeCard } from './DecorativeCard';
import { StepActionButtons } from './StepActionButtons';
import { OnboardStepProps } from '../onboarding.types';

export function OnboardingOne({ notNow, nextStep }: OnboardStepProps) {
  return (
    <DecorativeCard>
      <Box textAlign="center">
        <Text color="#f6fafd" fontSize="0.875rem">
          Guide Setup: 1 out of 4
        </Text>
        <Box color="#f6fafd" fontSize="1.4rem" marginTop="1.5rem" marginBottom="1.5rem">
          <Text fontSize="1.375rem">
            First things first, do you want to setup a contact or marketing list?
          </Text>
        </Box>
        <StepActionButtons onConfirm={nextStep} onCancel={notNow} />
      </Box>
    </DecorativeCard>
  );
}
