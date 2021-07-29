import {
  Avatar,
  Box,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PseudoBox,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/core';
import { Team, TeamMember } from 'app/authenticated-app/settings/settings.types';
import { selectOtherOrgMembers, selectTeams } from 'app/authenticated-app/settings/slices';
import { Input, OutsideClickHandler, XSmallText } from 'app/components';
import { selectUserID } from 'app/unauthenticated-app/authentication';
import React, { ChangeEvent, ReactNode, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'root';
import { ThreadSchema } from '../../inbox.types';

export type AssignmentMenuProps = {
  isOpen?: boolean;
  onClose?(): void;
  onItemClick?(member?: Partial<TeamMember> | Partial<Team>): void;
  assignments?: ThreadSchema['assignees'];
};

export const AssignmentMenu = (props: AssignmentMenuProps) => {
  const { isOpen, onClose, onItemClick, assignments } = props;
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <OutsideClickHandler maxW="305px" display="block" onClickOutside={() => onClose?.()}>
        <PopoverContent
          px="0"
          top="5rem"
          zIndex={10}
          maxW="305px"
          right="1rem"
          borderWidth="0"
          position="absolute"
          boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
          _focus={{ outline: 'none', boxShadow: '0px 5px 20px rgba(21, 27, 38, 0.08)' }}
        >
          <PopoverBody px="0" py="0">
            <DataTabs
              data={[
                {
                  label: 'User',
                  content: <UserTab onItemClick={onItemClick} assignments={assignments} />,
                },
                { label: 'Team', content: <TeamTab onItemClick={onItemClick} /> },
              ]}
            />
          </PopoverBody>
        </PopoverContent>
      </OutsideClickHandler>
    </Popover>
  );
};

const DataTabs = (props: { data: { label: string; content: ReactNode }[] }) => {
  const { data } = props;

  return (
    <Tabs>
      <TabList px="0.75rem" borderBottom="0">
        {data.map((tab, index) => (
          <Tab color="gray.900" _focus={{ boxShadow: 'none' }} p="0.5rem 0" mx="0.5rem" key={index}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel py={4} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

const UserTab = (props: Pick<AssignmentMenuProps, 'assignments' | 'onItemClick'>) => {
  const { onItemClick, assignments } = props;
  const [search, setSearch] = useState('');

  const assignedUsers = assignments?.map(item => item.user_id);

  const user_id = useSelector(selectUserID);
  const otherOrgMembers = useSelector((state: RootState) =>
    selectOtherOrgMembers(state, { user_id: user_id || '' }),
  );

  let members: TeamMember[] = useMemo(
    () =>
      otherOrgMembers.filter(
        ({ first_name, last_name }) =>
          first_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          last_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
    [search, otherOrgMembers],
  );

  return (
    <Box>
      <Box px="0.75rem">
        <Input
          size="sm"
          value={search}
          rounded="100px"
          borderColor="gray.200"
          rightIcon={<Icon name="search" color="gray.400" size="1rem" />}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </Box>

      <Stack mt="0.5rem" spacing="0" height="200px" overflowY="auto">
        {members.map(member => {
          const { id, first_name, last_name } = member;
          return (
            <PseudoBox
              key={id}
              py="0.5rem"
              px="0.75rem"
              display="flex"
              cursor="pointer"
              alignItems="center"
              _hover={{ bg: 'gray.200' }}
              justifyContent="space-between"
              onClick={() => onItemClick?.(member)}
            >
              <Stack cursor="pointer" isInline alignItems="center">
                <Avatar name={`${first_name} ${last_name}`} size="xs" bg="#5D34A5" color="white" />
                <XSmallText color="gray.900">{`${first_name} ${last_name}`}</XSmallText>
              </Stack>
              {assignedUsers?.includes(id) && <Icon name="check" size="0.8rem" color="#5ACA75" />}
            </PseudoBox>
          );
        })}
      </Stack>
    </Box>
  );
};

const TeamTab = (props: { onItemClick: AssignmentMenuProps['onItemClick'] }) => {
  const { onItemClick } = props;

  const [search, setSearch] = useState('');

  const orgTeams = useSelector(selectTeams);

  let teams: Team[] = useMemo(
    () =>
      orgTeams.filter(({ name }) => name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [search, orgTeams],
  );
  return (
    <Box>
      <Box px="0.75rem">
        <Input
          size="sm"
          value={search}
          rounded="100px"
          borderColor="gray.200"
          rightIcon={<Icon name="search" color="gray.400" size="1rem" />}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </Box>

      <Stack mt="0.5rem" spacing="0" height="200px" overflowY="auto">
        {teams.map(team => {
          const { id, name } = team;
          return (
            <PseudoBox
              key={id}
              py="0.5rem"
              px="0.75rem"
              cursor="pointer"
              _hover={{ bg: 'gray.200' }}
              onClick={() => onItemClick?.(team)}
            >
              <Stack isInline alignItems="center">
                <Avatar name={name} size="xs" bg="#5D34A5" color="white" />
                <XSmallText color="gray.900">{name}</XSmallText>
              </Stack>
            </PseudoBox>
          );
        })}
      </Stack>
    </Box>
  );
};
