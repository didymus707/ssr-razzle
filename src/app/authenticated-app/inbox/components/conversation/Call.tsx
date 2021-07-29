import React from 'react';
import { Stack, Flex, Box, Text, Icon } from '@chakra-ui/core';
import { formatTime } from '../../inbox.utils';

const getCallIcon = (value: string ) => {
  const data: any = {
    'Missed Call': 'missed-call',
    'Outgoing Call': 'outgoing-call',
    'Received Call': 'received-call'
  };

  return data[value];
};

export function Call() {
  const data: any[] = [
    { type: 'Missed Call', createdDateTime: '2020-05-14 03:39:38', name: 'Trevor Harper' },
    { type: 'Outgoing Call', createdDateTime: '2020-05-20 07:25:23', name: '+234 806 245 5714' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:35', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:10', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:11', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:12', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:13', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:14', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:15', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:16', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:17', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:18', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:19', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:20', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:21', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:22', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:23', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:24', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:25', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:26', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:27', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:28', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:29', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:30', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:31', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:32', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:33', name: 'Percy Jackson' },
    { type: 'Received Call', createdDateTime: '2020-05-22 11:20:34', name: 'Percy Jackson' },
  ];

  return (
    <Box overflowY="auto" height="calc(100vh - 9.875rem)">
      <Stack spacing=".875rem" marginX="2.375rem" marginBottom="1.375rem">
        {data.map(({ type, createdDateTime, name }, index) => (
          <Flex
            borderTop={index === 0 ? 'none' : 'solid 1px rgba(0, 0, 0, 0.08)'}
            key={`${name}-${createdDateTime}`}
            paddingTop={index === 0 ? '0' : '1.125rem'}
            paddingX=".375rem"
          >           
            <Icon name={getCallIcon(type)} size="1.375rem" />

            <Box marginLeft=".5rem">
              <Text fontSize=".875rem" fontWeight={500}>{name}</Text>

              <Text
                fontSize=".75rem"
                opacity={.5}
                marginTop=".625rem"
              >
                {type}
              </Text>
            </Box>

            <Text
              flex="1"
              ml=".9375rem"
              textAlign="right"
              opacity={.5}
              fontSize=".75rem"
            >
              {formatTime(new Date(createdDateTime))}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Box>
  )
}
