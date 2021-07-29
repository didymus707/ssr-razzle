import { Box, BoxProps, Stack } from '@chakra-ui/core';
import { BodyText, Button, PreTitle, Subtitle } from 'app/components';
import React, { ReactNode } from 'react';

type InboxSettingsPageProps = {
  title?: string;
  helperAlert?: {
    title?: string;
    caption?: string;
  };
  createAction?: {
    label?: string;
    onClick?(): void;
  };
  children: ReactNode;
} & BoxProps;

export const InboxSettingsPage = (props: InboxSettingsPageProps) => {
  const { title, helperAlert, createAction, children, ...rest } = props;

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <Box mb="2rem" pb="0.875rem" borderBottomWidth="1px">
        <Subtitle color="black">{title}</Subtitle>
      </Box>
      <Box {...rest}>
        {helperAlert && (
          <Box width="100%" mb="1.5rem" p="1.5rem" rounded="4px" bg="rgba(240, 238, 253, 0.42)">
            <PreTitle pb="0.875rem" color="black">
              {helperAlert?.title}
            </PreTitle>
            <BodyText color="black">{helperAlert.caption}</BodyText>
          </Box>
        )}
        {createAction && (
          <Stack width="100%" pb="2rem" isInline alignItems="center">
            {createAction && (
              <Box>
                <Button size="sm" onClick={createAction.onClick} variantColor="blue">
                  {createAction.label}
                </Button>
              </Box>
            )}
          </Stack>
        )}
        {children}
      </Box>
    </Box>
  );
};
