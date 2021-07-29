import {
  Avatar,
  Box,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PseudoBox,
  Spinner,
  Stack,
  Tooltip,
} from '@chakra-ui/core';
import { BodyText, Button, Input, InputProps, XSmallText } from 'app/components';
import React, { ReactNode, useRef, useState } from 'react';

export type InboxSearchProps = {
  children?: ReactNode;
  showButton?: boolean;
  isSearching?: boolean;
  onNewConversation?(): void;
  onSearch?(query: string): void;
} & InputProps;

export const InboxSearch = (props: InboxSearchProps) => {
  const {
    onSearch,
    children,
    isSearching,
    onNewConversation,
    showButton = true,
    placeholder = 'Search...',
    ...rest
  } = props;

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const initialFocusRef = useRef<HTMLInputElement>(null);

  const openMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
    if (children) {
      setTimeout(() => {
        openMenu();
      }, 1000);
    }
  };

  return (
    <>
      <Stack width="100%" isInline alignItems="center">
        <Box flex={1}>
          <Input
            value={query}
            borderWidth="0"
            onBlur={closeMenu}
            ref={initialFocusRef}
            onChange={handleSearch}
            placeholder={placeholder}
            backgroundColor="gray.100"
            _focus={{
              borderWidth: '0',
            }}
            leftIcon={<Icon name="search" color="#828282" />}
            rightIcon={isSearching && <Spinner color="gray.400" size="sm" />}
            {...rest}
          />
        </Box>
        {showButton && (
          <Box>
            <Button px="0" rounded="50%" variantColor="blue" onClick={onNewConversation}>
              <Tooltip zIndex={10000} label="Compose message" aria-label="compose-message">
                <Icon size="1.2rem" name="inbox-compose" color="white" />
              </Tooltip>
            </Button>
          </Box>
        )}
      </Stack>
      <Popover isOpen={isOpen} onClose={closeMenu} initialFocusRef={initialFocusRef}>
        <PopoverContent
          width="100%"
          maxW="28rem"
          rounded="4px"
          borderWidth="0"
          _focus={{ outline: 'none', boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.06)' }}
          boxShadow="0px 10px 15px rgba(0, 0, 0, 0.06)"
        >
          <PopoverBody px="0">{children}</PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export type SearchPeopleItemProps = {
  name?: string;
  platform_name?: string;
  platform_nick?: string;
};

export const SearchPeopleItem = (props: SearchPeopleItemProps) => {
  const { name, platform_name } = props;
  return (
    <PseudoBox cursor="pointer" _hover={{ bg: 'gray.100' }}>
      <Stack p="1rem" isInline alignItems="center">
        <Avatar color="white" size="sm" name={name} bg="#5D34A5" />
        <BodyText color="gray.900">{name}</BodyText>
        <XSmallText color="gray.500">{platform_name}</XSmallText>
      </Stack>
    </PseudoBox>
  );
};

export type SearchFileItemProps = {
  name?: string;
};

export const SearchFileItem = (props: SearchFileItemProps) => {
  const { name } = props;
  return (
    <PseudoBox cursor="pointer" _hover={{ bg: 'gray.100' }}>
      <Stack p="1rem" isInline alignItems="center">
        <Box width="1rem" height="1rem" rounded="4px" bg="#A4CF30" />
        <BodyText color="gray.900">{name}</BodyText>
      </Stack>
    </PseudoBox>
  );
};
