import React from 'react';
import { OnboardingStage } from '../../../payments.types';
import { Icon } from '@chakra-ui/core';

interface Props {
  value: OnboardingStage;
  label: string;
  active: boolean;
  completed: boolean;
  onClick: Function;
}

export const OnboardingStageComponent = (props: Props) => {
  const { active } = props;
  return (
    <div className="item" onClick={() => props.onClick()}>
      <Icon className="icon" name={`${active ? 'radio-filled' : 'radio-2'}`} size="32px" />
      <div className={`label ${active && 'active'}`}>{props.label}</div>
    </div>
  );
};
