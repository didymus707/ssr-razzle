import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import { DecorativeCard } from './DecorativeCard';
import { StepActionButtons } from './StepActionButtons';
import { OnboardStepProps } from '../onboarding.types';

export function OnboardingThree({ nextStep, notNow }: OnboardStepProps) {
  return (
    <DecorativeCard>
      <Box>
        <Box textAlign="center">
          <Text color="#f6fafd" fontSize="0.875rem">
            Guide Setup: 2 out of 4
          </Text>
          <Box
            color="#fff"
            fontSize="1.38rem"
            marginTop="1.5rem"
            marginBottom="1.9rem"
          >
            <Text fontSize="1.375rem">
              Do you want to setup communication channels (WhatApp, Messenger,
              SMS)?
            </Text>
          </Box>
          <StepActionButtons onConfirm={nextStep} onCancel={notNow} />
        </Box>
      </Box>
    </DecorativeCard>
  );
}
