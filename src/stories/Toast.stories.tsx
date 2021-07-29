//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ToastBox, ToastBoxProps } from 'app/components';

export default {
  title: 'Design System/Toast',
  component: ToastBox,
} as Meta;

const Template: Story<ToastBoxProps> = args => <ToastBox {...args} />;

export const Success = Template.bind({});
Success.args = {
  message: 'Success: Success Message',
  status: 'success',
};

export const Error = Template.bind({});
Error.args = {
  message: 'Error: Error Message',
};

export const Info = Template.bind({});
Info.args = {
  message: 'Notification: Notification Message',
  status: 'info',
};
