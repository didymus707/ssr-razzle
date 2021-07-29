import {
  Box,
  Button,
  Icon,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/core';
import React from 'react';

export type TableDropdownAction<T> = {
  icon?: string;
  label?: string;
  onClick?: (data: T) => void;
};

export function TableDropdown<T>({
  data,
  open,
  close,
  isOpen,
  actions,
}: {
  data: T;
  open?(): void;
  close?(): void;
  isOpen?: boolean;
  actions: TableDropdownAction<T>[];
}) {
  return (
    <Popover usePortal onOpen={open} onClose={close} isOpen={isOpen} placement="bottom-end">
      <PopoverTrigger>
        <Button
          size="sm"
          width="100%"
          display="flex"
          minWidth="unset"
          textAlign="center"
          variant="unstyled"
          padding="0 0.5rem"
          flexDirection="column"
          justifyContent="center"
          _focus={{ boxShadow: 'none' }}
          alignItems={['flex-start', 'flex-start', 'center', 'center']}
        >
          <Icon top="4px" name="more" size="0.875rem" color="gray.900" position="relative" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        zIndex={10000}
        maxWidth="180px"
        boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
        _focus={{ boxShadow: '0px 5px 20px rgba(21, 27, 38, 0.08)' }}
      >
        <List>
          {actions.map((action, i) => (
            <ListItem
              key={i}
              outline="none"
              cursor="pointer"
              _hover={{ backgroundColor: 'gray.100' }}
              onClick={() => action.onClick && action.onClick(data)}
            >
              <Stack
                isInline
                as="button"
                width="100%"
                spacing="2px"
                outline="none"
                cursor="pointer"
                padding="0.5rem"
                fontSize="0.75rem"
                alignItems="center"
              >
                {action.icon && (
                  <Box>
                    <ListIcon size="0.75rem" color="#66788a" icon={action.icon} />
                  </Box>
                )}
                <Box>
                  <Text>{action.label}</Text>
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
      </PopoverContent>
    </Popover>
  );
}
