import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  ModalCloseButton,
  PseudoBox,
  PseudoBoxProps,
  Stack,
  Text,
} from '@chakra-ui/core';
import React from 'react';
import { ModalContainer, ModalContainerOptions } from '../../../../../components';

type CampaignMetaModalProps = { options?: any[] } & ModalContainerOptions;
type MetaItemProps = {
  icon: string;
  title: string;
  caption: string;
  onSelect(): void;
  showButton?: boolean;
} & PseudoBoxProps;

export const CampaignMetaModal = ({
  title = 'Choose a link or template for your message',
  isOpen,
  onClose,
  options,
}: CampaignMetaModalProps) => {
  return (
    <ModalContainer
      size="md"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      titleStyleProps={{ fontSize: '1rem' }}
    >
      <ModalCloseButton size="sm" />
      <Box px="1.5rem" pb="1.5rem">
        {options?.map((option, index) => (
          <MetaItem
            key={`${index}`}
            {...option}
            borderBottomWidth={index === options.length - 1 ? '0' : '1px'}
          />
        ))}
      </Box>
    </ModalContainer>
  );
};

export const MetaItem = ({
  icon,
  title,
  caption,
  onSelect,
  showButton,
  ...rest
}: MetaItemProps) => {
  return (
    <PseudoBox
      py="1rem"
      cursor="pointer"
      transition="all 0.2s"
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      _hover={{ bg: 'gray.200', rounded: '12px' }}
      {...rest}
    >
      <Stack isInline alignItems="center">
        <Stack isInline flex={1}>
          <Flex
            size="30px"
            rounded="50%"
            bg="#f2f2f2"
            flex="0 0 30px"
            alignItems="center"
            justifyContent="center"
          >
            <Icon size="1rem" name={icon} />
          </Flex>
          <Box>
            <Heading pb="0.2rem" fontSize="0.875rem" fontWeight="bold">
              {title}
            </Heading>
            <Text width="90%" fontSize="0.7rem" color="#4f4f4f">
              {caption}
            </Text>
          </Box>
        </Stack>
        {showButton && (
          <Button size="xs" onClick={onSelect} variant="outline" variantColor="blue">
            Select
          </Button>
        )}
      </Stack>
    </PseudoBox>
  );
};
