//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Checkbox, CheckboxProps } from '@chakra-ui/core';

export default {
  title: 'Design System/Form/Checkbox',
  component: Checkbox,
} as Meta;

const Template: Story<CheckboxProps> = args => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Click me',
};

export const Checked = Template.bind({});
Checked.args = {
  children: 'Click me',
  defaultIsChecked: true,
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Click me',
  defaultIsChecked: true,
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Click me',
  defaultIsChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  size: 'lg',
  isDisabled: true,
  children: 'Click me',
  defaultIsChecked: true,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  size: 'lg',
  isDisabled: false,
  children: 'Click me',
  isIndeterminate: true,
  defaultIsChecked: true,
};
