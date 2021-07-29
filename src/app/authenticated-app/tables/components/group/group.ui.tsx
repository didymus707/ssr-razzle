import {
  Box,
  Flex,
  Icon,
  List,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core';
import React from 'react';
import { ConfirmModal } from '../../../../components';
import { GroupDropdownItem, GroupModal } from './group.components';
import { GroupSchema, GroupsDropdownProps } from './group.types';
import { PropertySearchForm } from '../property';

export function GroupsDropdown({
  data,
  onEdit,
  onClick,
  onDelete,
  children,
  isLoading,
  activeGroup,
  loadingDispatch,
  onFetchTableRows,
}: GroupsDropdownProps) {
  const [list, setList] = React.useState<GroupSchema[]>(data || []);
  const [groupToDelete, setGroupToDelete] = React.useState<string | undefined>(
    ''
  );
  const [groupToEdit, setGroupToEdit] = React.useState<
    GroupSchema | undefined
  >();

  React.useEffect(() => {
    setList(data);
  }, [data]);

  function handleSearch(value: string) {
    if (value) {
      const newList = list.filter((item) =>
        item.name.toLowerCase().startsWith(value.toLowerCase())
      );
      if (newList.length) {
        setList(newList);
      } else {
        setList(data);
      }
    } else {
      setList(data);
    }
  }

  function handleEditGroup(value: GroupSchema) {
    setList(
      list.map((x: GroupSchema) => {
        if (x.id === value.id) {
          return value;
        }
        return x;
      })
    );
    if (onEdit) {
      onEdit(value, () => setGroupToEdit(undefined));
    }
  }

  function handleDeleteGroup() {
    setList(list.filter((x: GroupSchema) => groupToDelete !== x.id));
    if (onDelete) {
      loadingDispatch({ type: 'LOADING_STARTED' });
      onDelete({ id: groupToDelete }, () => setGroupToDelete(''));
    }
  }

  return (
    <>
      <Popover placement="bottom-start">
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent zIndex={99999} paddingY="1rem" width="fit-content">
          <Flex paddingX="1rem" alignItems="center">
            <Icon size="0.75rem" name="folder" />
            <Text fontSize="14px" fontWeight={500} paddingLeft="0.5rem">
              Groups
            </Text>
          </Flex>
          <Box paddingX="1rem">
            <PropertySearchForm onChange={handleSearch} />
          </Box>
          <List>
            <GroupDropdownItem
              group={{ name: 'Table' }}
              onClick={onFetchTableRows}
            />
            {list.map((item, index) => (
              <GroupDropdownItem
                key={index}
                group={item}
                onDelete={() => {
                  setGroupToDelete(item.id);
                }}
                onClick={() => onClick(item)}
                onEdit={() => setGroupToEdit(item)}
                isActive={activeGroup?.id === item.id}
              />
            ))}
          </List>
        </PopoverContent>
      </Popover>

      <GroupModal
        title="Edit group"
        isLoading={isLoading}
        isOpen={!!groupToEdit}
        onSubmit={handleEditGroup}
        initialValues={groupToEdit}
        onClose={() => setGroupToEdit(undefined)}
      />

      <ConfirmModal
        title="Delete group"
        isLoading={isLoading}
        isOpen={!!groupToDelete}
        onConfirm={handleDeleteGroup}
        onClose={() => setGroupToDelete('')}
      />
    </>
  );
}
