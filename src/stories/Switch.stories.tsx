//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SwitchProps } from '@chakra-ui/core';
import { Switch } from '@app/components';

export default {
  title: 'Design System/Form/Switch',
  component: Switch,
} as Meta;

const Template: Story<SwitchProps> = args => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
  isChecked: false,
  children: 'Click me',
};

export const Checked = Template.bind({});
Checked.args = {
  isChecked: true,
  children: 'Click me',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  isChecked: false,
  children: 'Click me',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  isChecked: false,
  children: 'Click me',
};

export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  isChecked: false,
  children: 'Click me',
};
