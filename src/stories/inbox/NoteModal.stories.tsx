//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { NoteModal, NoteModalProps } from 'app/authenticated-app/inbox/components';

export default {
  title: 'Inbox/NoteModal',
  component: NoteModal,
} as Meta;

const Template: Story<NoteModalProps> = args => <NoteModal {...args} />;

export const AddNote = Template.bind({});
AddNote.args = {
  isOpen: true,
};

export const EditNote = Template.bind({});
EditNote.args = {
  isOpen: true,
  initialValues: {
    content: 'Hello world',
  },
};
