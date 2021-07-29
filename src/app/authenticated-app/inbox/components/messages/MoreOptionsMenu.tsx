import { Icon, IconProps, Stack } from '@chakra-ui/core';
import { TeamMember } from 'app/authenticated-app/settings/settings.types';
import { Menu, MenuItem, SmallText } from 'app/components';
import React from 'react';

type MenuOption = {
  label?: string;
  iconProps: IconProps;
  onItemClick?(): void;
};

export type MoreOptionsMenuProps = {
  options: MenuOption[];
  onAssign?(assignee: Partial<TeamMember>): void;
};

export const MoreOptionsMenu = (props: MoreOptionsMenuProps) => {
  const { options } = props;

  const renderTagItem = (item: MenuOption, index?: number) => {
    const { label, iconProps, onItemClick } = item;

    return (
      <MenuItem key={`${index}`} onClick={() => onItemClick?.()}>
        <Stack spacing="0.75rem" isInline alignItems="center">
          <Icon size="1rem" {...iconProps} />
          <SmallText textAlign="center" color="gray.900">
            {label}
          </SmallText>
        </Stack>
      </MenuItem>
    );
  };
  return (
    <Menu
      options={options}
      renderItem={renderTagItem}
      menuButtonProps={{
        px: '0',
        minW: 'unset',
        children: <Icon size="1.5rem" name="inbox-more" color="black" />,
      }}
    />
  );
};
