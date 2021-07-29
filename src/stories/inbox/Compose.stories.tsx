//@ts-nocheck
import React, { useRef, useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { MessageComposeForm, MessageComposeFormProps } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/Compose',
  component: MessageComposeForm,
} as Meta;

const Template: Story<MessageComposeFormProps> = args => <MessageComposeForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Hello world',
  setText: console.log,
};

export const Controlled = () => {
  const [text, setText] = useState('');
  const textAreaRef = useRef<any>(null);
  return <MessageComposeForm text={text} setText={setText} textAreaRef={textAreaRef} />;
};
