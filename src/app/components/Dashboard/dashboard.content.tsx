import * as React from 'react';
import { BoxProps } from '@chakra-ui/core';
import { DashboardContentWrapper } from './dashboard.content.styles';

type Props = {
  theme?: any;
  children: React.ReactNode;
} & BoxProps;

export const Content = ({ children, theme, ...rest }: Props) => {
  return (
    <DashboardContentWrapper
      width="100%"
      position="fixed"
      minHeight="calc(100vh-60px)"
      {...theme['Content']}
      {...rest}
      borderRadius="0px"
      boxShadow="none"
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme });
        }
      })}
    </DashboardContentWrapper>
  );
};
