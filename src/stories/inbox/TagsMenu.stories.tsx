//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TagsMenu, TagsMenuProps } from 'app/authenticated-app/inbox/components';

export default {
  title: 'Inbox/TagsMenu',
  component: TagsMenu,
} as Meta;

const Template: Story<TagsMenuProps> = args => <TagsMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  tags: [
    { name: 'Lead', color: '#DA1414' },
    { name: 'Support', color: '#FF5F5F' },
    { name: 'Urgent', color: '#4B9BFF' },
  ],
  onItemClick: console.log,
};
