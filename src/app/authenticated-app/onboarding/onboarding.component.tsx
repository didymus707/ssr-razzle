import { Box } from '@chakra-ui/core';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentWrapper } from '../../components';
import { User, UserProfile } from '../../unauthenticated-app/authentication';
import { WelcomeModal } from '../home/components';
import {
  OnboardingFive,
  OnboardingFour,
  OnboardingOne,
  OnboardingSix,
  OnboardingThree,
} from './components';

export function Onboarding({
  user,
  history,
  profile,
}: RouteComponentProps & {
  user: User | null;
  profile: UserProfile | null;
}) {
  const [step, setStep] = useState(1);

  function nextStep() {
    setStep(step + 1);
  }

  function renderContent() {
    switch (step) {
      case 1:
        return (
          <OnboardingOne
            user={user}
            notNow={() => setStep(2)}
            nextStep={() => history.push('/s/lists/new')}
          />
        );
      case 2:
        return <OnboardingThree user={user} nextStep={nextStep} notNow={() => setStep(4)} />;
      case 3:
        return <OnboardingFour profile={profile} user={user} nextStep={nextStep} />;
      case 4:
        return (
          <OnboardingFive
            user={user}
            notNow={nextStep}
            nextStep={() => history.push('/s/marketing/campaigns')}
          />
        );
      case 5:
        return (
          <OnboardingSix
            user={user}
            notNow={() => history.push('/s/home')}
            nextStep={() => history.push('/s/settings/organization/teams')}
          />
        );
      default:
        return <WelcomeModal nextStep={nextStep} />;
    }
  }

  return (
    <ContentWrapper paddingX="1rem">
      <Box maxWidth="600px" margin="3rem auto" borderRadius="10px">
        {renderContent()}
      </Box>
    </ContentWrapper>
  );
}
