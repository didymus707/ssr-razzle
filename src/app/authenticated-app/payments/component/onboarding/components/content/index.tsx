import React from 'react';
import { OnboardingStage } from '../../../../payments.types';
import { getPaymentOnboardingContentComponent } from '../../../../payments.utils';

interface Props {
  stage: OnboardingStage;
  setStage: Function;
  data: any;
  updatePaymentSetup: Function;
}

export const OnboardingContent = (props: Props) => {
  const { stage } = props;

  const Component = getPaymentOnboardingContentComponent(stage);

  return (
    <div className="content">
      <Component {...props} />
    </div>
  );
};
