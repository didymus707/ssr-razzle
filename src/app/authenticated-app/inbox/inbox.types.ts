import { BoxProps, FlexProps, IconProps, StackProps } from '@chakra-ui/core';
import { FormLabelProps } from '@chakra-ui/core/dist/FormLabel';
import { MutableRefObject, RefObject } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TextareaAutosizeProps } from 'react-textarea-autosize';
import { TableContactOptions } from '../tables';
import { ConversationFilterAccordionItemProps } from './components';

export type InboxStatusSchema = 'idle' | 'loading' | 'success' | 'error';

export type ThreadStateSchema = 'assigned' | 'resolved' | 'queued' | 'unknown';

export type EntityMetaSchema = {
  count: number;
  pageSize: number;
  pageCount: number;
  page: number;
};

export type AddressBookSchema = {
  id?: number;
  uuid: string;
  contact_id: string;
  customer_id: string;
  organisation_id: string;
  created_datetime?: string;
  updated_datetime?: string;
};

export type PlatformContactSchema = {
  id?: number;
  uuid: string;
  name: string;
  meta?: any;
  customer_id: string;
  organisation_id: string;
  receiver_platform_id: string;
  created_datetime?: string;
  updated_datetime?: string;
};

export type ContactColumnSchema = {
  contact_id: string;
  [key: string]: string | number;
};

export type ContactSchema = {
  id: string;
  table_id: string;
  created_datetime?: string;
  updated_datetime?: string;
};

export type ThreadSchema = {
  resolved_datetime?: string | null;
  state: string;
  uuid: string;
  type: string;
  unread_count?: number;
  updated_datetime: string;
  created_datetime: string;
  receiver_id: string;
  sender_id: string;
  resolver_id?: string | null;
  assignments: {
    uuid: string;
    assigner_id: string;
    assignee_id: string;
  }[];
  assignees?: {
    uuid?: string;
    user_id: string;
    last_name: string;
    first_name: string;
    organisation_id: string;
    created_datetime?: string;
    updated_datetime?: string;
  }[];
  is_favorited: boolean;
  tags: InboxTag[];
  last_message?: {
    uuid: string;
    content: {
      body: string;
      subject?: string;
    };
    status: string;
    meta: {
      urls: string[];
      mentions: string[];
      hash_tags: string[];
      symbols: string[];
      bcc?: string[];
      cc?: string[];
      message_type?: 'payment_request' | 'payment_received' | 'normal' | 'log';
      payment_link_id?: string;
    };
    has_attachment: boolean;
    is_read: boolean;
  };
  receiver: {
    status: string;
    uuid: string;
    user_id: string;
    image_url: string | null;
    email: string | null;
    platform_name: string;
    platform_nick: string;
    channel_name: Channel;
  };
  sender: {
    uuid: string;
    name: string;
    contact_id?: string;
    email?: string | null;
    channel_name: Channel;
    platform_nick?: string;
    image_url?: string | null;
  };
};

export type AssignmentSchema = {
  uuid: string;
  thread_id: string;
  created_datetime: string;
  updated_datetime?: string;
  assigner_id: string; // => TeamMember
  assignee_id: string; // => TeamMember
};

export type NoteSchema = {
  uuid: string;
  content: string;
  assignment_id: string;
  created_datetime: string;
  updated_datetime?: string;
  author_id: string; // => TeamMember
};

export type InboxUserSchema = {
  id?: number;
  is_customer: boolean;
  uuid: string; // => CustomerSchema | TeamMember
};

export type CustomerSchema = {
  uuid: string;
  email?: string;
  channel: string;
  image_url?: string;
  platform_name?: string;
  platform_nick?: string;
};

export type UnfurledUrlSchema = {
  description?: string;
  image?: string;
  title?: string;
  type?: string;
  url?: string;
};

export type MessageMetaSchema = {
  type: 'normal' | 'payment_request' | 'assignment' | 'payment_received';
  unfurledUrl?: UnfurledUrlSchema;
  message_id: MessageSchema['uuid'];
};

export type CommonAttachmentDataSchema = {
  url: string;
  attachment_id: string;
};

export type ImageDataSchema = CommonAttachmentDataSchema & {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  previewUrl?: string;
  sizes?: {
    [k: string]: {
      w: number;
      h: number;
      resize: string;
    };
  };
};

export type VideoDataSchema = Omit<ImageDataSchema, 'maxWidth' | 'maxHeight'> & {
  aspectRatio?: number[];
  variants?: {
    bitrate: string;
    content_type: string;
    url: string;
  }[];
};

export type AttachmentDataSchema = CommonAttachmentDataSchema | ImageDataSchema | VideoDataSchema;

export type AttachmentSchema = {
  id: string;
  name?: string;
  type: string;
  size?: string;
  message_id: string;
  data?: AttachmentDataSchema;
};

export type MessageSchema = {
  uuid: string;
  id?: number;
  content?: string;
  attachments?: AttachmentSchema[];
  created_datetime: string;
  thread_id: string;
  updated_datetime?: string;
  status?: string;
  state: ThreadSchema['state'];
  meta?: MessageMetaSchema;
  author_id: string; // => InboxUserSchma
  others?: {
    hasAttachment: boolean;
  };
};

export type NotificationSchema = {
  uuid: string;
  id?: number;
  updated_datetime?: string;
  created_datetime?: string;
  user_id: string; // => InboxUserSchma
  message_id: string; // => MessageSchema
  status: 'sent' | 'read' | 'delivered' | 'unsent';
};

export type StartThreadPayloadSchema = {
  sender_name: string;
  contact?: TableContactOptions;
  credential: any;
  customer: Pick<CustomerSchema, 'channel' | 'platform_nick'>;
};

export type InboxProps = RouteComponentProps<{ id: string }>;

type ToggleUserOverviewType = 'none' | 'mini' | 'full';
export type UserOverviewProps = {
  toggleUserOverview: ToggleUserOverviewType;
  onCloseMobileDrawer?(): void;
  onUserOverViewToggled: (v?: ToggleUserOverviewType) => void;
};

export type TwoWayPayloadSchema = {
  contact_id?: string;
  contactName?: string;
  credential_id?: string;
  senderPlatformNick: string;
};

export type ThreadStarterProps = FlexProps & {
  text: string;
  channels?: any;
  showCompose: boolean;
  setActiveFilter?: () => void;
  twoWayPayload: TwoWayPayloadSchema;
  setShowCompose: (v: boolean) => void;
  setText: (v: string, i?: boolean) => void;
  setTwoWayPayload: React.Dispatch<React.SetStateAction<TwoWayPayloadSchema>>;
  setActiveThread?: React.Dispatch<React.SetStateAction<ThreadSchema | undefined>>;
};

export type MessageProps = {
  onMobileUserOverViewOpen?(): void;
  onCloseMobileMessageDrawer?(): void;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  onUserOverViewToggled: UserOverviewProps['onUserOverViewToggled'];
} & FlexProps;

export type MessageHeaderProps = FlexProps & {
  sender_id: string;
  receiver_id: string;
  currentThreadID: string;
};

export interface ConversationThreadProps extends BoxProps {
  threadRef: RefObject<HTMLDivElement>;
}

export type MessageItemProps = {
  previousItemID: string;
  nextItemID: string;
  itemID: string;
  threadSenderID: string;
  messageRef: React.RefObject<HTMLElement>;
};

export type PaymentLinkMetaSchema = {
  invoice?: string;
  delivery?: 'delivery' | 'pickup';
  provider: {
    value: 'paystack' | 'onepipe';
    text: 'Paystack' | 'SimpuPay';
  };
  expiry_date: { value: number; text: string };
};

export type PaymentRequestItemSchema = {
  uuid: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
};

export type PaymentRequestSchema = {
  currency?: string;
  order_type?: 'delivery' | 'pickup';
  provider: 'paystack' | 'onepipe';
  expiry_date: number | string;
  invoice_number?: string;
  items: PaymentRequestItemSchema[];
};

export type ComposeIconsProps = {
  value?: string;
  attachedFiles: File[];
  isModalOpened: boolean;
  isCreatingLink?: boolean;
  paymentItems: PaymentItemSchema[];
  paymentRequest: PaymentRequestSchema;
  paymentLinkMeta: PaymentLinkMetaSchema;
  setIsModalOpened: (v: boolean) => void;
  setAttachedFiles: (v: File[]) => void;
  textAreaRef: MessageProps['textAreaRef'];
  onSendPaymentRequest?(payload: any): void;
  setPaymentItems: (v: PaymentItemSchema[]) => void;
  setPaymentRequest: (v: PaymentRequestSchema) => void;
  setText: (v: string, i?: boolean, s?: string) => void;
  setPaymentLinkMeta: (v: PaymentLinkMetaSchema) => void;
  setIsTemplateMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FilePickerProps = Omit<FormLabelProps, 'children'> & {
  channel?: CustomerSchema['channel'];
  textAreaRef?: MessageProps['textAreaRef'];
  files: ComposeIconsProps['attachedFiles'];
  setFiles: ComposeIconsProps['setAttachedFiles'];
  iconProps?: IconProps;
};

export type EditorWithEmojiProps = TextareaAutosizeProps &
  React.RefAttributes<HTMLTextAreaElement> & {
    handleSubmit: any;
    isTemplateMode?: boolean;
    setText: (text: string) => void;
    textAreaRef: MessageProps['textAreaRef'];
  };

export type EditorProps = Partial<EditorWithEmojiProps>;

export type ComposeAttachments = {
  onClick?(): void;
  showDeleteButton?: boolean;
  files: ComposeIconsProps['attachedFiles'];
  onUpload?: (file: File, url: string) => void;
  setFiles: ComposeIconsProps['setAttachedFiles'];
};

export type ConversationProps = {
  toggleResolve: boolean;
  setToggleResolve: (v: boolean) => void;
  textAreaRef: MessageProps['textAreaRef'];
};

export type ChatProps = FlexProps & {
  searchQuery: string;
  searchedResult?: { threads: string[]; messages: string };
  toggleResolve: ConversationProps['toggleResolve'];
  setToggleResolve: ConversationProps['setToggleResolve'];
};

export type ConversationSectionProps = BoxProps & {
  name: string;
  haveViewEntireControl?: boolean;
  highlight?: string;
};

export type ConversationListProps = {
  list?: string[];
  isSearch?: boolean;
  heading?: ConversationSectionProps['name'];
  highlight?: ConversationSectionProps['highlight'];
};

export type ConversationItemProps = {
  highlight?: string;
  itemID: ThreadSchema['uuid'];
};

export type PaymentItemSchema = {
  id: string;
  name: string;
  amount: number;
};

export type PaymentListProps = StackProps & {
  list: PaymentItemSchema[];
  onUpdate: (name: string, value: string, index: number) => void;
  onDelete: (index: number) => void;
};

export type PaymentItemProps = PaymentItemSchema &
  FlexProps & {
    index: number;
    showControls: boolean;
    onUpdate: (name: string, value: string) => void;
    onDelete: () => void;
  };

export type AttachmentProps = {
  message_id?: string;
  isOrgUser: boolean;
  receiver: any;
  attachments: any[];
};

export type MessageItemViewProps = {
  timeViewRef: MutableRefObject<HTMLParagraphElement | undefined>;
  messageRef: MessageItemProps['messageRef'];
  itemID: MessageItemProps['itemID'];
  isOrgUser: boolean;
  isChannelAcct?: boolean;
  type?: MessageMetaSchema['type'];
  status: string;
  content: string;
  attachments?: AttachmentSchema[];
  linkMetaDatas?: any[];
  threadReceiverUserID?: string;
  threadSenderID: string;
  author_id: string;
  time: string;
  hasAttachment?: boolean;
  nextItemID?: string;
  previousItemID?: string;
};

export type FilterTypeOptions = Pick<
  ConversationFilterAccordionItemProps,
  'label' | 'children' | 'icon' | 'iconColor'
>;

export type Channel = 'whatsapp' | 'messenger' | 'phone' | 'twitter' | 'whatsappWeb' | 'email';

export type InboxTag = {
  created_datetime?: string;
  creator_id?: string;
  description?: string;
  id?: number;
  name: string;
  organisation_id?: string;
  updated_datetime?: string | null;
  uuid: string;
  color: string;
};

export type InboxConnection = {
  id: string;
  table_id?: string | null;
  table_name?: string | null;
  data_model_id?: string | null;
  data_model_name?: string | null;
  variables: {
    filters: {
      name: string;
      value: any;
      operator: string;
      channel?: Channel;
      columnType: string;
      columnID: string | number;
      subOperator: string | null;
    }[];
    channel_id?: '';
  };
  created_datetime: string | null;
  updated_datetime: string | null;
};

export type UserChannelSchema = {
  id: number;
  status: string;
  organisation_id: string;
  uuid: string;
  updated_datetime: string;
  created_datetime: string;
  user_id: string;
  user: {
    id: number;
    image_url: string;
    email?: string | null;
    platform_name?: string | null;
    platform_nick?: string | null;
    uuid: string;
    updated_datetime: string;
    created_datetime: string;
    channel_name: string;
    channel_id: string;
  };
  connectivities?: {
    id: number;
    disconnected_datetime: string;
    connected_datetime: string;
    uuid: string;
    updated_datetime: string;
    created_datetime: string;
    disconnector_id: string;
    connector_id: string;
    credential_id: string;
  }[];
};

export type QuickReplySchema = {
  uuid: string;
  created_datetime?: string;
  id: number;
  name: string;
  attachments?: any[] | null;
  author_id?: string;
  table_id?: string;
  template: {
    content: string;
    subject: string;
  };
  updated_datetime?: string | null;
};

export type SignatureSchema = {
  id: number;
  uuid: string;
  user_id: string;
  content: string;
  organisation_id: string;
  created_datetime: string;
  is_default: boolean | null;
  updated_datetime: string | null;
};

export type InboxMessage = {
  uuid: string;
  status: 'unsent' | 'sent' | 'delivered' | 'read';
  type: 'message' | 'comment';
  thread_id: string;
  attachments: any[];
  created_datetime: string;
  updated_datetime: string;
  author: {
    name: string;
    uuid: string;
    image_url: string;
    is_customer?: boolean;
    platform_nick: string;
  };
  request: {
    id: number;
    uuid: string;
    code: string;
    amount: number;
    order_type: null;
    provider: string;
    currency: string;
    cancelled: boolean;
    provider_code: null;
    invoice_number: string;
    updated_datetime: string;
    created_datetime: string;
  };
  notifications: Partial<NotificationSchema>[];
  notification_status: 'sent' | 'read' | 'delivered' | 'unsent';
  content: {
    body: string;
    subject?: string;
    content_type?: 'text' | 'html';
  };
  meta: {
    urls: string[];
    mentions: string[];
    hash_tags: string[];
    symbols: string[];
    bcc?: string[];
    cc?: string[];
    message_type?: 'payment_request' | 'payment_received' | 'normal' | 'log';
    payment_link_id?: string;
  };
};
