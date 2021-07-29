//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MoreOptionsMenu, MoreOptionsMenuProps } from 'app/authenticated-app/inbox/components';

export default {
  title: 'Inbox/MoreOptionsMenu',
  component: MoreOptionsMenu,
} as Meta;

const Template: Story<MoreOptionsMenuProps> = args => <MoreOptionsMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  options: [
    {
      label: 'Add Notes',
      iconProps: { color: 'blue.500', name: 'inbox-add-note' },
      onItemClick: console.log,
    },
    {
      label: 'Resolve Conversation',
      iconProps: { color: '#5ACA75', name: 'inbox-resolve-conversation' },
      onItemClick: console.log,
    },
    {
      label: 'Assign Conversation',
      iconProps: { color: '#AF78FF', name: 'inbox-assign-conversation' },
      onItemClick: console.log,
    },
    {
      label: 'Mark Unread',
      iconProps: { color: '#50D2A0', name: 'inbox-mark-unread' },
      onItemClick: console.log,
    },
  ],
};
