//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { AssignmentMenu, AssignmentMenuProps } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/AssignmentMenu',
  component: AssignmentMenu,
} as Meta;

const Template: Story<AssignmentMenuProps> = args => <AssignmentMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
};
