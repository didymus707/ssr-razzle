import * as React from 'react';
import { TablesDropdownProps } from '../table.types';
import { TablePropertiesOptions } from '../../../tables.types';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Flex,
  Text,
  Box,
  List,
  Icon,
} from '@chakra-ui/core';
import { ConfirmModal } from '../../../../../components';
import { TableDropdownItem } from './TableDropdownItem';
import { PropertySearchForm } from '../../property';

export function TablesDropdown({
  data = [],
  children,
  onClick,
  onDelete,
  isLoading,
  activeTable,
}: TablesDropdownProps) {
  const [list, setList] = React.useState<TablePropertiesOptions[]>(data || []);
  const [tableIndex, setTableIndex] = React.useState<
    TablePropertiesOptions['id']
  >('');

  React.useEffect(() => {
    setList(data);
  }, [data]);

  function handleClose() {
    setTableIndex('');
  }

  function handleSearch(value: string) {
    if (value) {
      const newList = list.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      if (newList.length) {
        setList(newList);
      } else {
        setList([]);
      }
    } else {
      setList([]);
    }
  }

  function handleGroupDelete() {
    setList(list.filter((x: TablePropertiesOptions) => tableIndex !== x.id));
    if (onDelete) {
      onDelete({ id: tableIndex, callback: handleClose });
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
              Tables
            </Text>
          </Flex>
          <Box paddingX="1rem">
            <PropertySearchForm onChange={handleSearch} />
          </Box>
          <List>
            {list.map((item, index) => (
              <TableDropdownItem
                key={index}
                table={item}
                onDelete={() => {
                  setTableIndex(item.id);
                }}
                onClick={() => onClick(item)}
                isActive={activeTable?.id === item.id}
              />
            ))}
          </List>
        </PopoverContent>
      </Popover>

      <ConfirmModal
        title="Delete table"
        isOpen={!!tableIndex}
        isLoading={isLoading}
        onConfirm={handleGroupDelete}
        onClose={() => setTableIndex('')}
      />
    </>
  );
}
