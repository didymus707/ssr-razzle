//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { RadioProps } from '@chakra-ui/core';
import { Radio } from '@app/components';

export default {
  title: 'Design System/Form/Radio',
  component: Radio,
} as Meta;

const Template: Story<RadioProps> = args => <Radio {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Click me',
};

export const Checked = Template.bind({});
Checked.args = {
  children: 'Click me',
  isChecked: true,
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Click me',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Click me',
};

export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  children: 'Click me',
};
