import { Icon, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';

export type DateFilter = {
  label: string;
  value: number;
};

export type DateFilterDropdownProps = {
  filters: DateFilter[];
  onFilterChange?(filter: DateFilter): void;
};

export function DateFilterDropdown(props: DateFilterDropdownProps) {
  const { filters, onFilterChange } = props;
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>(filters[0]);

  const handleFilterChange = (filter: DateFilter) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  useEffect(() => {}, []);

  return (
    <Menu>
      <MenuButton>
        <Stack isInline alignItems="center">
          <Text color="#4f4f4f" fontWeight={500} fontSize="0.75rem" textTransform="uppercase">
            {selectedFilter.label}
          </Text>
          <Icon color="#4f4f4f" name="chevron-down" />
        </Stack>
      </MenuButton>
      <MenuList minW="10px" placement="bottom-start">
        {filters.map((filter, index) => (
          <MenuItem
            color="#4f4f4f"
            fontWeight={500}
            key={`${index}`}
            fontSize="0.75rem"
            textTransform="uppercase"
            onClick={() => handleFilterChange(filter)}
          >
            {filter.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
