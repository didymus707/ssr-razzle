import { Box, Flex, Icon, IconProps, PseudoBox, Stack } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { SmallText, Subtitle, Button } from 'app/components';
import React, { MouseEvent } from 'react';

export type InboxSettingsPageItemProps = {
  iconProps?: IconProps;
  heading?: string;
  caption?: string;
  onClick?(): void;
  onDelete?(): void;
  showDeleteButton?: boolean;
};

export const InboxSettingsPageItem = (props: InboxSettingsPageItemProps) => {
  const { iconProps, caption, heading, onClick, onDelete, showDeleteButton = true } = props;

  const handleDelete = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <InboxSettingsPageItemContainer
      py="1rem"
      px="0.5rem"
      _hover={{
        bg: 'gray.200',
        rounded: '8px',
      }}
      cursor="pointer"
      onClick={onClick}
      display="flex"
      alignContent="center"
      justifyItems="space-between"
      borderBottomWidth="1px"
    >
      <Stack flex={1} isInline alignItems="center">
        <Flex
          width="48px"
          bg="gray.100"
          rounded="50%"
          height="48px"
          alignItems="center"
          justifyContent="center"
        >
          <Icon size="1.5rem" {...iconProps} />
        </Flex>
        <Box>
          <Subtitle
            color="black"
            fontSize="1.125rem"
            dangerouslySetInnerHTML={{ __html: heading ?? '' }}
          />
          {caption && (
            <SmallText
              pt="0.5rem"
              color="black"
              dangerouslySetInnerHTML={{ __html: caption ?? '' }}
            />
          )}
        </Box>
      </Stack>
      {showDeleteButton && (
        <Button
          opacity={0}
          height="unset"
          variant="unstyled"
          onClick={handleDelete}
          className="delete-button"
        >
          <Icon size="24px" name="inbox-trash" color="#DA1414" />
        </Button>
      )}
    </InboxSettingsPageItemContainer>
  );
};

const InboxSettingsPageItemContainer = styled(PseudoBox)`
  transition: all 0.2s;
  &:hover {
    .delete-button {
      opacity: 1;
    }
  }
`;
