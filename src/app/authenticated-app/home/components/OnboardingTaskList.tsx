import { Box, Flex, Icon, List, ListItem, Text } from '@chakra-ui/core';
import React from 'react';
import { Link as NextLink } from 'react-router-dom';
import { TaskListItem } from '../home.types';
import { HomeCard } from './HomeCard';

export function OnboardingTaskList({ taskList }: { taskList: TaskListItem[] }) {
  const completed = taskList.filter(({ isCompleted }) => isCompleted);
  return (
    <HomeCard marginTop="2.0rem" marginBottom="7rem">
      <Flex flexWrap="wrap" justifyContent="space-between" marginTop="2.5rem">
        <Text
          fontSize="18px"
          color="#212242"
          fontWeight="semibold"
          paddingBottom={['0.5rem', '0.5rem', '0', '0']}
        >
          Complete these tasks to start using Simpu.
        </Text>
        <Box fontSize="14px" color="#212242" paddingBottom={['0.5rem', '0.5rem', '0', '0']}>
          {completed.length} out of {taskList.length}
          <Text>complete</Text>
        </Box>
      </Flex>
      <List>
        {taskList.map((item, index) => (
          <ListItem width="100%" _even={{ background: '#f6fafd' }} marginTop="0.6rem" key={index}>
            <Flex fontSize="14px" padding="0.9rem">
              {item.isCompleted === false ? (
                <Flex width="100%" alignItems="center" justifyContent="space-between">
                  <Icon size="2.5rem" color="#f6fafd" name="notCompleted" />
                  <Flex
                    width="100%"
                    marginLeft="1.1rem"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                  >
                    <Text fontWeight="semibold" color="#212242">
                      {item.name}
                    </Text>
                    <Text color="#595e8a">{item.desc}</Text>
                  </Flex>
                  <Box fontSize="14px" color="#00b3a6" alignSelf="center" fontWeight="semibold">
                    <NextLink to={item.url}>{item.buttonLabel}</NextLink>
                  </Box>
                </Flex>
              ) : (
                <Flex>
                  <Icon size="2.5rem" name="completed" color="rgba(67, 90, 111, 0.47)" />
                  <Flex
                    textDecoration="line-through"
                    marginLeft="1.1rem"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                  >
                    <Text fontWeight="semibold" color="#212242">
                      {item.name}
                    </Text>
                    <Text color="#595e8a">{item.desc}</Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </ListItem>
        ))}
      </List>
    </HomeCard>
  );
}
