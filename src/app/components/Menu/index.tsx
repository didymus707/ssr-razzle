import {
  Menu as ChakraMenu,
  MenuButton,
  MenuButtonProps,
  MenuDivider,
  MenuGroup,
  MenuGroupProps as ChakraMenuGroupProps,
  MenuItem as ChakraMenuItem,
  MenuItemProps,
  MenuList,
  MenuListProps,
  MenuProps as ChakraMenuProps,
} from '@chakra-ui/core';
import React, { forwardRef, ReactNode } from 'react';

type MenuGroupProps = {
  title: ChakraMenuGroupProps['title'];
  options: any[];
};

export type MenuProps = ChakraMenuProps & {
  options: any[];
  menuButtonProps: MenuButtonProps;
  renderEmptyState?: () => ReactNode;
  renderItem: (option: any, index?: number) => void;
};

export type MenuWithGroupProps = ChakraMenuProps & {
  groups: MenuGroupProps[];
  menuButtonProps: MenuButtonProps;
  renderEmptyState?: () => ReactNode;
  renderItem: (option: any, index?: number) => void;
} & { menuListProps?: Partial<MenuListProps> };

export const MenuItem = (props: MenuItemProps) => (
  <ChakraMenuItem
    {...props}
    color="gray.900"
    _hover={{
      bg: 'gray.200',
    }}
  />
);

export const Menu = forwardRef(
  (props: Omit<MenuProps, 'children'> & { menuListProps?: Partial<MenuListProps> }, ref: any) => {
    const { options, renderItem, renderEmptyState, menuButtonProps, menuListProps } = props;
    return (
      <ChakraMenu>
        <MenuButton {...menuButtonProps} />
        <MenuList
          ref={ref}
          borderWidth="0"
          boxShadow="0px 10px 15px rgba(0, 0, 0, 0.06)"
          {...menuListProps}
        >
          {options.length ? options.map(renderItem) : renderEmptyState}
        </MenuList>
      </ChakraMenu>
    );
  },
);

export const MenuWithGroup = (props: MenuWithGroupProps) => {
  const { menuButtonProps, renderItem, groups, renderEmptyState, menuListProps } = props;
  return (
    <ChakraMenu>
      <MenuButton {...menuButtonProps} />
      <MenuList borderWidth="0" boxShadow="0px 10px 15px rgba(0, 0, 0, 0.06)" {...menuListProps}>
        {groups.length
          ? groups.map((group, index) => (
              <>
                <MenuGroup title={group.title}>{group.options.map(renderItem)}</MenuGroup>
                {index !== groups.length - 1 && <MenuDivider />}
              </>
            ))
          : renderEmptyState}
      </MenuList>
    </ChakraMenu>
  );
};
