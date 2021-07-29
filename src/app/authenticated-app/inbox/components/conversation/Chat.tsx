import React from 'react';
import {
  Flex, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Icon
} from '@chakra-ui/core';
import { isEmpty } from 'lodash';
import { NavLink, useHistory } from 'react-router-dom';
import { ConversationList } from './ConversationList';
import { ChatProps, ThreadSchema } from '../../inbox.types';
import { SocialIcon } from '../../../../components';
import { selectActiveOrgCredentials } from '../../../channels';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeConversationTabIndex, selectConversationTabIndex, selectOrgThreadsByStateStatusCount,
  selectOrgThreadsCount,
} from '../../slices';
import { RootState } from '../../../../../root';
import { selectOrganisationID, selectUserID } from '../../../../unauthenticated-app/authentication';
import { SearchResult } from './SearchResult';

export function Chat({
  searchQuery, toggleResolve, searchedResult, setToggleResolve, ...rest
}: ChatProps) {
  const history = useHistory();
  const dispatch = useDispatch();
  const supportedChannels = useSelector(selectActiveOrgCredentials);
  const conversationTabIndex = useSelector(selectConversationTabIndex);
  const organisation_id = useSelector(selectOrganisationID) || '';
  const queuedThreadscount = useSelector(
    (state: RootState) => selectOrgThreadsCount(state, {
      organisation_id, state: 'queued'
    })
  );
  const user_id = useSelector(selectUserID) || '';
  const assignedThreadsUnreadCount = useSelector(
    (state: RootState) => selectOrgThreadsByStateStatusCount(state, {
      organisation_id, user_id, state: 'assigned'
    })
  );
  const resolvedThreadsUnreadCount = useSelector(
    (state: RootState) => selectOrgThreadsByStateStatusCount(state, {
      organisation_id, user_id, state: 'resolved'
    })
  );

  const inds: boolean[] = [queuedThreadscount, assignedThreadsUnreadCount, resolvedThreadsUnreadCount].map(
    (item) => item > 0
  );
  const tabItems: ({ icon: string, title: string })[] = [
    { icon: 'time', title: 'unassigned' },
    { icon: 'open-mail', title: 'open' },
    { icon: 'check', title: 'closed' },
  ];

  return (
    <Flex flexDirection="column" overflowY="hidden" {...rest}>
      {searchQuery.length >= 2 ? <SearchResult searchedResult={searchedResult} searchQuery={searchQuery} /> : (
        <Tabs
          flex={1}
          display="flex"
          flexDirection="column"
          index={conversationTabIndex}
          overflowY="hidden"
          onChange={(tabIndex: number) => dispatch(changeConversationTabIndex({ tabIndex }))}
        >
          <TabList paddingX="1rem" borderColor="rgba(0, 0, 0, 0.05)" justifyContent="space-between">
            {tabItems.map(({ icon, title }, index) => (
              <Tab
                key={title}
                fontSize=".875rem"
                opacity={0.5}
                _selected={{
                  color: '#3d50df',
                  borderBottom: '3px solid #3d50df',
                  outline: 'none',
                  opacity: 'unset',
                  paddingBottom: '.5rem',
                  boxShadow: 'none',
                }}
                _focus={{ boxShadow: 'none' }}
                _active={{ boxShadow: 'none' }}
                fontWeight={500}
                paddingX=".5rem"
                paddingBottom=".6875rem"
              >
                <Flex alignItems="center" justifyContent="center">
                  <Icon name={icon} size="1rem" />
                  <Text
                    fontSize='.6875rem'
                    lineHeight="16px"
                    textAlign="center"
                    letterSpacing=".05rem"
                    marginLeft=".25rem"
                    textTransform="uppercase"
                  >
                    {title}
                  </Text>

                  {inds[index] && (
                    <Box
                      height="0"
                      padding=".1875rem"
                      borderRadius="50%"
                      alignSelf="flex-start"
                      backgroundColor="blue.500"
                    />
                  )}
                </Flex>
              </Tab>
            ))}
          </TabList>

          <TabPanels
            flex={1}
            id="scrollableDiv"
            className="remove-focus-outline"
            overflowY="auto"
            height="100%"
            paddingY="1rem"
          >
            {isEmpty(supportedChannels) ? (
              <Box textAlign="center" paddingTop="1rem" paddingX="1.5rem">
                <Text fontWeight={600} marginBottom=".625rem">
                  Connect your accounts
              </Text>

                <Text fontSize=".875rem" opacity={0.5} lineHeight={1.79} marginBottom="1.875rem">
                  Once you’ve connected all your inboxes, all your messages will show here.
              </Text>

                {[
                  { icon: 'whatsapp', text: 'Connect WhatsApp' },
                  { icon: 'twitter', text: 'Connect Twitter' },
                ].map(({ icon, text }, index) => (
                  <Button
                    key={icon}
                    variantColor="blue"
                    marginTop={index !== 0 ? '.625rem' : '0'}
                    borderRadius="5px"
                    padding="0.375rem .75rem"
                    fontWeight="normal"
                    height="auto"
                    onClick={() => history.push(`/s/integrations/${icon}`)}
                  >
                    <SocialIcon which={icon} size="1.1875rem" />

                    <Text fontSize=".875rem" marginLeft=".625rem">
                      {text}
                    </Text>
                  </Button>
                ))}

                <NavLink to="/s/channels">
                  <Text fontSize=".875rem" fontWeight={500} color="blue.500" marginTop="1.875rem">
                    Check more channels
                </Text>
                </NavLink>
              </Box>
            ) : (
              (['queued', 'assigned', 'resolved'] as ThreadSchema['state'][]).map(item => (
                <TabPanel key={item}>
                  <ConversationList heading={item} />
                </TabPanel>
              ))
            )}
          </TabPanels>
        </Tabs>
      )}
    </Flex>
  );
}
