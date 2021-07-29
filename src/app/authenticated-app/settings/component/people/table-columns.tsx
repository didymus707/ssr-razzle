import React, { SyntheticEvent } from 'react';
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
} from '@chakra-ui/core';
import { capitalize } from 'lodash';
import moment from 'moment';

const OptionItem = (props: { onClick?: Function; icon: string; label: string; color?: string }) => (
  <MenuItem
    // @ts-ignore
    onClick={props?.onClick}
    color={props.color}
    fontSize="12px"
  >
    <Icon name={props.icon} size="14px" mr="10px" color={props.color} />
    {props.label}
  </MenuItem>
);

export const PeopleTableColumns = ({ copyMemberEmail }: any) => [
  {
    Header: 'Name',
    width: 225,
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      const name = `${capitalize(original.first_name)} ${capitalize(original.last_name)}`;

      return (
        <Box display="flex" height="100%" alignItems="center">
          <Avatar size="sm" name={name} marginRight="15px" />
          <Box>{name}</Box>
        </Box>
      );
    },
  },
  {
    Header: 'Email',
    width: 375,
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return (
        <Box color="#757575" height="100%" display="flex" alignItems="center">
          {original.email}
        </Box>
      );
    },
  },
  {
    Header: 'Last Login',
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return (
        <Box color="#757575" height="100%" display="flex" alignItems="center">
          {original.updated_datetime && moment(original.updated_datetime).format('MMM Do')}
        </Box>
      );
    },
  },
  {
    Header: '',
    width: 100,
    accessor: 'id',
    Cell: ({ row: { original } }: any) => {
      return (
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <Menu>
            <MenuButton
              as={IconButton}
              // @ts-ignore
              icon="overflow"
              size="sm"
              padding=".5rem"
              variant="ghost"
              height="auto"
              minWidth="auto"
              onClick={(event: SyntheticEvent) => event.stopPropagation()}
            />

            <MenuList minWidth="150px" placement="bottom">
              <OptionItem
                icon="copy"
                label="Copy email"
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  copyMemberEmail(original);
                }}
              />
              <OptionItem
                icon="delete"
                label="Remove user"
                color="#E73D51"
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                }}
              />
            </MenuList>
          </Menu>
        </Box>
      );
    },
  },
];
