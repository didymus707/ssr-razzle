//@ts-nocheck
import { Stack } from '@chakra-ui/core';
import { Meta, Story } from '@storybook/react';
import {
  InboxSettingsChannelItem,
  InboxSettingsPage,
  InboxSettingsPageProps,
} from 'app/authenticated-app/inbox/settings';
import React from 'react';

export default {
  title: 'Inbox/Settings/Pages',
  component: InboxSettingsPage,
} as Meta;

const Template: Story<InboxSettingsPageProps> = args => <InboxSettingsPage {...args} />;

export const Channels = Template.bind({});
Channels.args = {
  title: 'Channels',
  children: (
    <>
      <Stack isInline>
        <InboxSettingsChannelItem
          name="Twitter"
          isActive={false}
          category="Simpu Integration"
          caption="Social Networking"
          iconProps={{ name: 'twitter' }}
        />
      </Stack>
    </>
  ),
};

export const QuickReplies = Template.bind({});
QuickReplies.args = {
  title: 'Quick Replies',
  helperAlert: {
    title: 'Quick replies',
    caption:
      'You can use quick replies to quickly respond to conversations. You can use variables in your quick replies to fill the dynamic content, such as recipients name.',
  },
  createAction: {
    label: 'Create a quick reply',
    onClick: console.log,
  },
  children: <></>,
};

export const Tags = Template.bind({});
Tags.args = {
  title: 'Tags',
  helperAlert: {
    title: 'Tags',
    caption:
      'Tags are labels to help you keep track of conversations related to a given topic. Team tags are visible to everyone on your team. In analytics, admins can create reports based on tags. You can click on the tag icon at the top of a conversation to apply a tag.',
  },
  createAction: {
    label: 'Create a tag',
    onClick: console.log,
  },
  children: <></>,
};

export const Signatures = Template.bind({});
Signatures.args = {
  title: 'Signatures',
  helperAlert: {
    title: 'Signatures',
    caption:
      'Tags are labels to help you keep track of conversations related to a given topic. Team tags are visible to everyone on your team. In analytics, admins can create reports based on tags. You can click on the tag icon at the top of a conversation to apply a tag.',
  },
  createAction: {
    label: 'Create a signature',
    onClick: console.log,
  },
  children: <></>,
};
