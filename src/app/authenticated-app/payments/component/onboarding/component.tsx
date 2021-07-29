import { IconButton } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { OnboardingStage } from '../../payments.types';
import { Wrapper } from './component.styles';
import { OnboardingStageComponent } from './components';
import { OnboardingContent } from './components/content';
import { useSelector } from 'react-redux';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';

type stage_option = {
  label: string;
  value: OnboardingStage;
};

const stages: stage_option[] = [
  {
    label: 'Get Started',
    value: 'get-started',
  },
  {
    label: 'ID Information',
    value: 'id-information',
  },
  {
    label: 'Account Owner',
    value: 'account-owner',
  },
  {
    label: 'Business Details',
    value: 'business-details',
  },
  {
    label: 'Summary',
    value: 'summary',
  },
];

export const PaymentsOnboardingComponent = (props: any) => {
  const [stage, setStage] = useState<OnboardingStage>('get-started');

  const router_history = useHistory();

  useEffect(() => {
    if (props.payment_setup.data.status === 'submitted') setStage('summary');
    if (props.payment_setup.data.approval_status === 'successful')
      router_history.push('/s/payments');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const organization_id = useSelector(selectOrganisationID);

  const onClose = () => {
    props.fetchWallet(organization_id);
    router_history.push('/s/payments');
  };

  return (
    <Wrapper>
      <div className="side-bar">
        <div className="heading">
          <div className="title">Payments</div>
          <div className="subtitle">Account Setup</div>
        </div>
        <div className="section-stages">
          {stages.map(i => (
            <OnboardingStageComponent
              key={i.value}
              value={i.value}
              label={i.label}
              active={stage === i.value}
              completed={false}
              onClick={() => setStage(i.value)}
            />
          ))}
        </div>
      </div>
      <OnboardingContent
        stage={stage}
        setStage={setStage}
        data={props.payment_setup.data}
        updatePaymentSetup={props.updatePaymentSetup}
      />
      <IconButton className="close-icon" aria-label="close" icon="close" onClick={onClose} />
    </Wrapper>
  );
};
