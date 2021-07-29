//@ts-nocheck
import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  InboxSettingsSidebarLink,
  InboxSettingsSidebarLinkProps,
} from 'app/authenticated-app/inbox/settings';

export default {
  title: 'Inbox/Settings/SidebarLink',
  component: InboxSettingsSidebarLink,
} as Meta;

const Template: Story<InboxSettingsSidebarLinkProps> = args => (
  <InboxSettingsSidebarLink {...args} />
);

export const Channels = Template.bind({});
Channels.args = {
  to: 'channels',
  children: 'Channels',
  icon: 'inbox-channels',
};

export const QuickReplies = Template.bind({});
QuickReplies.args = {
  to: 'quick-replies',
  children: 'Quick Replies',
  icon: 'inbox-compose-quote',
};

export const Tags = Template.bind({});
Tags.args = {
  to: 'tags',
  children: 'Tags',
  icon: 'inbox-tag',
};
