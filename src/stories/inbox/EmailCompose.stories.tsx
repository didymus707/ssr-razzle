//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { EmailMessageCompose } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/EmailCompose',
  component: EmailMessageCompose,
} as Meta;

const Template: Story<any> = args => <EmailMessageCompose {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  initialValues: {
    from: 'tioluwani@simpu.co',
    to: 'nimi@simpu.co',
    cc: 'c@simpu.co',
    bcc: 'kola@simpu.co',
  },
  channel: 'email',
  sender_id: '2323sadadsa234asd',
};
