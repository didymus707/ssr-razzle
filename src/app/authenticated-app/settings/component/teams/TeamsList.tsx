import {
  Avatar,
  Box,
  Icon,
  List,
  ListItem,
  Menu,
  MenuButton,
  Stack,
  Text,
  MenuList,
  MenuItem,
  IconButton,
  AvatarGroup,
} from '@chakra-ui/core';
import * as React from 'react';
import { Team, TeamMember } from '../../settings.types';

export type TeamListItemProps = {
  team: Team;
  lastTeam?: boolean;
  onClick?(): void;
  onEditTeam?(): void;
  onDeleteTeam?(): void;
};

export function TeamListItem({
  team,
  onClick,
  onEditTeam,
  onDeleteTeam,
  lastTeam,
}: TeamListItemProps) {
  const { name, color, members } = team;
  return (
    <ListItem
      padding="1rem"
      onClick={onClick}
      transition="all 0.1s ease-in-out"
      borderBottom={lastTeam ? 'none' : '1px solid rgba(0,0,0,0.05)'}
      _hover={{
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
      }}
    >
      <Stack isInline alignItems="center" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <Avatar size="sm" name={name} color="white" backgroundColor={color} />
          <Text marginLeft="10px" color="#333333" fontSize="0.875rem">
            {name}
          </Text>

          <Box
            fontSize="10px"
            padding="2px 5px"
            backgroundColor="#e6e8ed"
            borderRadius="3.5px"
            marginX="10px"
            fontWeight="500"
          >
            {members?.length} member(s)
          </Box>
        </Stack>
        <Box display="flex" alignItems="center">
          <AvatarGroup size="sm" max={2} marginX="20px">
            {members?.map((i: TeamMember, index: number) => (
              <Avatar key={index} name={`${i.first_name} ${i.last_name}`} />
            ))}
          </AvatarGroup>
          <Menu>
            <MenuButton
              size="xs"
              as={IconButton}
              //@ts-ignore
              variant="ghost"
              icon="overflow"
              alignItems="center"
              justifyContent="center"
              onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
            />
            <MenuList zIndex={10} minWidth="150px" placement="bottom">
              <MenuItem
                fontSize="0.875rem"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onEditTeam && onEditTeam();
                }}
                color="#333333"
                _hover={{
                  color: '#3d50df',
                  backgroundColor: 'rgba(61, 80, 223, 0.06)',
                }}
                _focus={{
                  color: '#3d50df',
                  backgroundColor: 'rgba(61, 80, 223, 0.06)',
                }}
                _active={{
                  color: '#3d50df',
                  backgroundColor: 'rgba(61, 80, 223, 0.06)',
                }}
              >
                <Icon paddingRight="0.2rem" name="edit" />
                <span>Edit team</span>
              </MenuItem>
              <MenuItem
                fontSize="0.875rem"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onDeleteTeam && onDeleteTeam();
                }}
                color="#333333"
                _hover={{
                  color: '#3d50df',
                  backgroundColor: 'rgba(61, 80, 223, 0.06)',
                }}
                _focus={{
                  color: '#3d50df',
                  backgroundColor: 'rgba(61, 80, 223, 0.06)',
                }}
                _active={{
                  color: '#3d50df',
                  backgroundColor: 'rgba(61, 80, 223, 0.06)',
                }}
              >
                <Icon paddingRight="0.2rem" name="delete" />
                <span>Delete team</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Stack>
    </ListItem>
  );
}

export type TeamsListProps = {
  teams: Team[];
  onClick?(id: Team['id']): void;
  onEditTeam?(value: Team): void;
  onDeleteTeam?(value: Team): void;
};

export function TeamsList({ teams, onClick, onEditTeam, onDeleteTeam }: TeamsListProps) {
  return (
    <List>
      {teams.map((team, i) => (
        <TeamListItem
          key={i}
          lastTeam={i === teams.length - 1}
          team={team}
          onClick={() => onClick && onClick(team.id)}
          onEditTeam={() => onEditTeam && onEditTeam(team)}
          onDeleteTeam={() => onDeleteTeam && onDeleteTeam(team)}
        />
      ))}
    </List>
  );
}
