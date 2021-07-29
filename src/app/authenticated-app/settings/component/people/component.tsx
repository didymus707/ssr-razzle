import { Box, Heading, Stack, useToast } from '@chakra-ui/core/dist';
import { EmptyState, Input, Table, ToastBox } from 'app/components';
import React, { useMemo, useState } from 'react';
import noPeople from '../../assets/no-people.svg';
import { PeopleWrapper as Wrapper } from './index.styles';
import { PeopleTableColumns } from './table-columns';

export const PeopleComponent = (props: any) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { people } = props;

  const rows = people.filter((i: any) =>
    JSON.stringify(i).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toast = useToast();

  const copyMemberEmail = (member: any) => {
    navigator.clipboard.writeText(member.email);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox status="info" onClose={onClose} message="Member email copied" />
      ),
    });
  };

  const columns = useMemo(
    () => PeopleTableColumns({ copyMemberEmail }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Wrapper>
      <Stack isInline alignItems="center" marginBottom="1.5rem">
        <Heading size="sm" color="#333333" fontWeight="semibold">
          Manage People
        </Heading>
        <Box fontWeight="400" color="#757575" fontSize="14px">
          - {people.length} user(s)
        </Box>
      </Stack>

      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Input
          placeholder="Search by name or email"
          size="sm"
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {/* <Divider marginX="5px" />
        <Input placeholder="Invite by email" size="sm" />
        <Divider marginX="5px" />
        <Button size="sm" isDisabled width="80px" height="30px" variantColor="blue">
          Invite
        </Button> */}
      </Box>

      <Box marginTop="25px">
        {rows.length > 0 && (
          <Table
            // @ts-ignore
            columns={columns}
            data={rows}
            onRowClick={() => {}}
          />
        )}
        {rows.length === 0 && (
          <EmptyState
            marginY="10vh"
            image={noPeople}
            subheading="No users found in your search"
            subheadingProps={{ marginTop: '25px', fontWeight: '500' }}
          />
        )}
      </Box>
    </Wrapper>
  );
};
