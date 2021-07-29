//@ts-nocheck
import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  InboxSettingsSidebar,
  InboxSettingsSidebarLink,
  InboxSettingsSidebarProps,
} from 'app/authenticated-app/inbox/settings';
import { Stack } from '@chakra-ui/core';

export default {
  title: 'Inbox/Settings/Sidebar',
  component: InboxSettingsSidebar,
} as Meta;

const Template: Story<InboxSettingsSidebarProps> = args => <InboxSettingsSidebar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: (
    <Stack>
      <InboxSettingsSidebarLink icon="inbox-channels" to="/">
        Channels
      </InboxSettingsSidebarLink>
      <InboxSettingsSidebarLink icon="inbox-rules" to="/">
        Rules
      </InboxSettingsSidebarLink>
      <InboxSettingsSidebarLink icon="inbox-compose-quote" to="/">
        Quick Replies
      </InboxSettingsSidebarLink>
      <InboxSettingsSidebarLink icon="inbox-signature" to="/">
        Signatures
      </InboxSettingsSidebarLink>
      <InboxSettingsSidebarLink icon="inbox-tag" to="/">
        Tags
      </InboxSettingsSidebarLink>
    </Stack>
  ),
};
