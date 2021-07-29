//@ts-nocheck
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Chatbubble } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/Chatbubble',
  component: Chatbubble,
} as Meta;

const Template: Story = args => <Chatbubble {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: '(500) 555-0006',
    platform_nick: '+15005550006',
    channel: 'sms',
  },
  message: {
    uuid: '',
    status: '',
    type: '',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: '',
      platform_nick: '',
      image_url: '',
      isCustomer: false,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: '',
      content_type: '',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: [''],
      cc: [''],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const IsAuthor = Template.bind({});
IsAuthor.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: '(500) 555-0006',
    platform_nick: '+15005550006',
    channel: 'sms',
  },
  message: {
    uuid: '',
    status: '',
    type: '',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: 'eb8bd71fabe5484d83df2773d380e9de',
      platform_nick: '',
      image_url: '',
      isCustomer: true,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: '',
      content_type: '',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: [''],
      cc: [''],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const Failed = Template.bind({});
Failed.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: '(500) 555-0006',
    platform_nick: '+15005550006',
    channel: 'sms',
  },
  message: {
    uuid: '',
    status: 'unsent',
    type: 'message',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: 'eb8bd71fabe5484d83df2773d380e9de',
      platform_nick: '',
      image_url: '',
      isCustomer: true,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: '',
      content_type: '',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: [''],
      cc: [''],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const HTMLPrimary = Template.bind({});
HTMLPrimary.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: 'Collins',
    platform_nick: 'c@simpu.co',
    channel: 'gmail',
  },
  message: {
    uuid: '',
    status: 'read',
    type: 'message',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: 'eb8bd71fabe5484d83df2773d380e9dd',
      platform_nick: 'nimi@simpu.co',
      image_url: '',
      isCustomer: false,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: 'Good morning',
      content_type: 'html',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: undefined,
      cc: undefined,
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const HTMLIsAuthor = Template.bind({});
HTMLIsAuthor.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: 'Collins',
    platform_nick: 'c@simpu.co',
    channel: 'gmail',
  },
  message: {
    uuid: '',
    status: 'read',
    type: 'message',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: 'eb8bd71fabe5484d83df2773d380e9de',
      platform_nick: 'nimi@simpu.co',
      image_url: '',
      isCustomer: true,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: 'Good morning',
      content_type: 'html',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: ['kola@simpu.co', 'tioluwani@simpu.co', 'yomi@simpu'],
      cc: ['kola@simpu.co', 'tioluwani@simpu.co', 'yomi@simpu', 'micheal@simpu.co'],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const Comment = Template.bind({});
Comment.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: 'Collins',
    platform_nick: 'c@simpu.co',
    channel: 'gmail',
  },
  message: {
    uuid: '',
    status: 'read',
    type: 'comment',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: 'eb8bd71fabe5484d83df2773d380e9de',
      platform_nick: 'nimi@simpu.co',
      image_url: '',
      isCustomer: true,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: 'Good morning',
      content_type: 'text',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: [''],
      cc: [''],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const ImageAttachment = Template.bind({});
ImageAttachment.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: '(500) 555-0006',
    platform_nick: '+15005550006',
    channel: 'sms',
  },
  message: {
    uuid: '',
    status: 'sent',
    type: '',
    thread_id: '',
    attachments: [
      {
        type: 'image',
        data: {
          url:
            'https://res.cloudinary.com/simpu-inc/image/upload/v1614341403/bnrjq1svvqpljgiz189y.jpg',
        },
      },
    ],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: '',
      platform_nick: '',
      image_url: '',
      isCustomer: false,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: '',
      content_type: '',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: [''],
      cc: [''],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const MultipleImageAttachment = Template.bind({});
MultipleImageAttachment.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: '(500) 555-0006',
    platform_nick: '+15005550006',
    channel: 'sms',
  },
  message: {
    uuid: '',
    status: 'sent',
    type: '',
    thread_id: '',
    attachments: [
      {
        type: 'image',
        data: {
          url:
            'https://res.cloudinary.com/simpu-inc/image/upload/v1614341403/bnrjq1svvqpljgiz189y.jpg',
        },
      },
      {
        type: 'image',
        data: {
          url:
            'https://res.cloudinary.com/simpu-inc/image/upload/v1614341403/bnrjq1svvqpljgiz189y.jpg',
        },
      },
      {
        type: 'image',
        data: {
          url:
            'https://res.cloudinary.com/simpu-inc/image/upload/v1614341403/bnrjq1svvqpljgiz189y.jpg',
        },
      },
      {
        type: 'image',
        data: {
          url:
            'https://res.cloudinary.com/simpu-inc/image/upload/v1614341403/bnrjq1svvqpljgiz189y.jpg',
        },
      },
    ],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: '',
      platform_nick: '',
      image_url: '',
      isCustomer: false,
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: '',
      content_type: '',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      message_type: '',
      payment_link_id: '',
    },
  },
};

export const PaymentRequest = Template.bind({});
PaymentRequest.args = {
  receiver: {
    status: 'active',
    uuid: '2bff1cae0e0042f880bda93171724525',
    user_id: 'eb8bd71fabe5484d83df2773d380e9de',
    image_url: null,
    email: null,
    platform_name: 'Collins',
    platform_nick: 'c@simpu.co',
    channel: 'gmail',
  },
  message: {
    uuid: '',
    status: 'read',
    type: 'message',
    thread_id: '',
    attachments: [],
    created_datetime: '',
    updated_datetime: '',
    author: {
      name: 'Nimi Martins',
      uuid: 'eb8bd71fabe5484d83df2773d380e9dd',
      platform_nick: 'nimi@simpu.co',
      image_url: '',
      isCustomer: false,
    },
    request: {
      id: 24,
      uuid: 'd69457bff0c75415a2b4233782a30d27',
      code: 'KLBJKEF',
      currency: 'NGN',
      amount: 555555,
      provider: 'onepipe',
      cancelled: false,
      order_type: null,
      invoice_number: '',
      provider_code: null,
      updated_datetime: '2021-06-23T17:23:26.230Z',
      created_datetime: '2021-06-23T17:23:25.937Z',
    },
    content: {
      body:
        'Good Morning Collins, thank you for reaching out, the document will be sent by 3:30pm.',
      subject: 'Good morning',
      content_type: 'html',
    },
    meta: {
      urls: [''],
      mentions: [''],
      hash_tags: [''],
      symbols: [''],
      bcc: undefined,
      cc: undefined,
      message_type: 'payment_received',
      payment_link_id: '',
    },
  },
};
