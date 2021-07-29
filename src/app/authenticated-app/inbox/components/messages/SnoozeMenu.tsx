import {
  Box,
  Flex,
  Icon,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/core';
import { Button, Input, XSmallText } from 'app/components';
import { addDays, addHours, addWeeks, format, formatDistanceToNowStrict, getDay } from 'date-fns';
import React, { useState } from 'react';

export type SnoozeMenuProps = {
  onSelectDate?(date: Date): void;
};

export const SnoozeMenu = ({ onSelectDate }: SnoozeMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const handleSelect = (value: Date) => {
    onSelectDate?.(value);
    close();
  };

  return (
    <Popover isOpen={isOpen} onClose={close}>
      <PopoverTrigger>
        <Button px="0" minW="unset" onClick={open} variant="unstyled">
          <Icon size="1.5rem" color="gray.500" name="inbox-snoozed" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        right="0"
        zIndex={10}
        maxW="220px"
        borderWidth="0"
        position="absolute"
        boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
        _focus={{ boxShadow: '0px 5px 20px rgba(21, 27, 38, 0.08)' }}
      >
        <PopoverBody px="0">
          <Box mx="0.75rem">
            <Input
              mb="1rem"
              size="sm"
              rounded="0"
              borderWidth="0"
              borderColor="gray.200"
              borderBottomWidth="1px"
              placeholder="E.g. Tomorrow 10am"
              _focus={{
                borderColor: 'blue.500',
                borderBottomWidth: '1px',
              }}
              rightIcon={<Icon size="1rem" color="gray.800" name="inbox-calendar" />}
            />
          </Box>
          <List>
            {defaultOptions.map(({ value, iconProps, label, caption }, index) => (
              <ListItem
                px="0.75rem"
                height="2rem"
                display="flex"
                cursor="pointer"
                alignItems="center"
                key={`${label}-${index}`}
                _hover={{ bg: 'gray.200' }}
                onClick={() => handleSelect(value)}
              >
                <Flex width="100%" alignItems="center" justifyContent="space-between">
                  <Stack flex={1} isInline alignItems="center">
                    <ListIcon size="1rem" icon={iconProps.name} color={iconProps.color} />
                    <XSmallText color="gray.900">{label}</XSmallText>
                  </Stack>
                  <XSmallText color="gray.400">{caption}</XSmallText>
                </Flex>
              </ListItem>
            ))}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const getDayValue = (limit: number) => {
  const dayOfWeek = getDay(new Date());
  if (dayOfWeek < limit) {
    return addDays(new Date(), limit - dayOfWeek);
  } else if (dayOfWeek > limit) {
    return addDays(new Date(), limit + 1);
  }
  return addWeeks(new Date(), 1);
};

const getAfternoonValue = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 12) {
    return addHours(new Date(), 12 - currentHour);
  } else if (currentHour >= 12 && currentHour < 17) {
    return addDays(new Date(), 1);
  } else if (currentHour >= 17 && currentHour < 24) {
    return addHours(new Date(), currentHour);
  }
  return addDays(new Date(), 1);
};

const defaultOptions = [
  {
    label: 'Later',
    value: addHours(new Date(), 3),
    iconProps: { name: 'inbox-later', color: 'blue.500' },
    caption: formatDistanceToNowStrict(addHours(new Date(), 3), { addSuffix: true }),
  },
  {
    label: 'Afternoon',
    value: getAfternoonValue(),
    caption: format(getAfternoonValue(), 'EEE do, hh:mm'),
    iconProps: { name: 'inbox-afternoon', color: '#FFD76E' },
  },
  {
    label: 'Tomorrow',
    value: addDays(new Date(), 1),
    caption: format(addDays(new Date(), 1), 'EEE do, hh:mm'),
    iconProps: { name: 'inbox-tomorrow', color: '#5ACA75' },
  },
  {
    label: 'Friday',
    value: getDayValue(5),
    caption: format(getDayValue(5), 'EEE do, hh:mm'),
    iconProps: { name: 'inbox-friday', color: '#4B9BFF' },
  },
  {
    label: 'Saturday',
    value: getDayValue(6),
    caption: format(getDayValue(6), 'EEE do, hh:mm'),
    iconProps: { name: 'inbox-saturday', color: '#DA1414' },
  },
];
