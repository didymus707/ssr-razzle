//@ts-nocheck
import React from 'react';
import { Meta } from '@storybook/react';
import { Button, Menu, MenuItem, MenuWithGroup } from 'app/components';

export default {
  title: 'Design System/Menu',
} as Meta;

export const SimpleMenu = (...args) => (
  <Menu
    {...{
      ...args,
      renderItem: option => <MenuItem {...option} />,
      menuButtonProps: { children: 'Open Menu', as: Button },
      options: [{ children: 'Profile' }, { children: 'Logout' }],
    }}
  />
);

export const GroupMenu = (...args) => (
  <MenuWithGroup
    {...{
      ...args,
      renderItem: option => <MenuItem {...option} />,
      menuButtonProps: { children: 'Open Menu', as: Button },
      groups: [
        {
          title: 'Settings',
          options: [{ children: 'Profile Settings' }, { children: 'Organization Settings' }],
        },
        { title: 'Others', options: [{ children: 'Organization Name' }, { children: 'Logout' }] },
      ],
    }}
  />
);
