//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ThreadSection, ThreadSectionProps } from 'app/authenticated-app/inbox';
import * as ThreadListStories from './ThreadList.stories';

export default {
  title: 'Inbox/ThreadSection',
  component: ThreadSection,
} as Meta;

const Template: Story<ThreadSectionProps> = args => <ThreadSection {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...ThreadListStories.Primary.args,
  activeFilter: 'queued',
};
