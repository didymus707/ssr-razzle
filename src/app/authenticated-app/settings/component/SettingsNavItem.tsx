import { Box, Heading, Icon, Stack, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';
import React from 'react';
import { NavLink } from 'react-router-dom';

const SettingsNavItemContainer = styled.div`
  a {
    &.is-active {
      width: 100%;
      display: block;
      border-right: 4px solid #2034c5;
    }
  }
`;

export type SettingsNavItemProps = {
  url: string;
  icon?: string;
  heading?: string;
  subheading?: string;
};

export const SettingsNavItem = ({
  url,
  icon,
  heading,
  subheading,
}: SettingsNavItemProps) => {
  return (
    <SettingsNavItemContainer>
      <NavLink to={url} activeClassName="is-active">
        <Stack
          isInline
          padding="1rem"
          color="inherit"
          borderBottom="solid 1px rgba(0, 0, 0, 0.05)"
        >
          <Icon name={icon} />
          <Box>
            <Heading
              color="inherit"
              fontSize="0.875rem"
              fontWeight={500}
              paddingBottom="0.2rem"
            >
              {heading}
            </Heading>
            <Text fontSize="0.75rem" color="rgba(17,17,17,0.5)">
              {subheading}
            </Text>
          </Box>
        </Stack>
      </NavLink>
    </SettingsNavItemContainer>
  );
};
