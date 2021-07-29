import React from 'react';
import { Box, Icon } from '@chakra-ui/core/dist';

interface NavItemProps {
  label: string;
  icon: string;
  active: boolean;
  disabled?: boolean;
  onClick: Function;
}

const NavItem = (props: NavItemProps) => {
  return (
    <Box
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
      className={`nav-item ${props.active && 'active'} ${props.disabled && 'disabled'}`}
    >
      <Box className="icon-bg">
        <Icon size="18px" name={props.icon} />
      </Box>
      <Box>{props.label}</Box>
    </Box>
  );
};

export const ChangePlanStageNavigator = (props: any) => {
  const { stage, setStage, allowCheckout } = props;

  return (
    <Box className="section-stage-nav">
      <NavItem
        onClick={() => setStage('select-plan')}
        active={stage === 'select-plan'}
        label="Choose your plan"
        icon="up-down"
      />
      <NavItem
        onClick={() => setStage('checkout')}
        active={stage === 'checkout'}
        disabled={!allowCheckout}
        label="Checkout"
        icon="credit-card"
      />
    </Box>
  );
};
