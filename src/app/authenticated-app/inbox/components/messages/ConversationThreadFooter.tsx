import { Box, Stack, useToast } from '@chakra-ui/core';
import { selectOtherOrgMembers } from 'app/authenticated-app/settings/slices';
import { html2Text } from 'app/authenticated-app/marketing/templates/templates.utils';
import { ToastBox } from 'app/components';
import { selectProfile, selectUserID } from 'app/unauthenticated-app/authentication';
import { AxiosError } from 'axios';
import { endOfTomorrow } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'root';
import { INITIAL_PAYMENT_REQUEST } from '../..';
import {
  resolveConversationThread,
  sendMessage,
  sendPaymentRequest,
  startThread,
} from '../../inbox.service';
import {
  PaymentItemSchema,
  PaymentLinkMetaSchema,
  PaymentRequestSchema,
  ThreadSchema,
} from '../../inbox.types';
import { useInbox } from '../Provider';
import {
  CommentCompose,
  EmailMessageCompose,
  MessageComposeForm,
  MessageComposeFormProps,
} from './compose';
import { createRow } from 'app/authenticated-app/tables';
import { selectContactList } from 'app/authenticated-app/lists/lists.slice';
import { sendAmplitudeData } from 'utils/amplitude';

export type ConversationThreadFooterProps = {
  text?: string;
  thread?: ThreadSchema;
  setActiveFilter?(): void;
  isTemplateMode?: boolean;
  showEmailCompose?: boolean;
  onCloseEmailCompose?(): void;
  lastMessage?: ThreadSchema['last_message'];
  twoWayPayload: MessageComposeFormProps['twoWayPayload'];
  setTwoWayPayload: MessageComposeFormProps['setTwoWayPayload'];
  setActiveThread?: React.Dispatch<React.SetStateAction<ThreadSchema | undefined>>;
};

export const ConversationThreadFooter = (props: ConversationThreadFooterProps) => {
  const { isNewConversation } = useInbox();
  const {
    lastMessage,
    twoWayPayload,
    text: textProp,
    setActiveThread,
    setActiveFilter,
    setTwoWayPayload,
    onCloseEmailCompose,
    thread = {} as ThreadSchema,
    isTemplateMode: isTemplateModeProp,
    showEmailCompose = isNewConversation,
  } = props;
  const { uuid: currentThreadID, receiver, sender = {} as ThreadSchema['sender'] } = thread;
  const { channel_name, uuid: sender_id } = sender;

  const INITIAL_PAYMENT_ITEM: PaymentItemSchema = {
    name: '',
    amount: 0,
    id: new Date().getTime().toString(),
  };

  const toast = useToast();
  const queryClient = useQueryClient();
  const user_id = useSelector(selectUserID);
  const profile = useSelector(selectProfile);
  const contactList = useSelector(selectContactList);
  const otherOrgMembers = useSelector((state: RootState) =>
    selectOtherOrgMembers(state, { user_id: user_id || '' }),
  );

  const [text, setText] = useState(textProp ?? '');
  const [commentText, setCommentText] = useState('');
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isTemplateMode, setIsTemplateMode] = useState(isTemplateModeProp ?? false);
  const [paymentItems, setPaymentItems] = React.useState<PaymentItemSchema[]>([
    INITIAL_PAYMENT_ITEM,
  ]);
  const [paymentLinkMeta, setPaymentLinkMeta] = useState<PaymentLinkMetaSchema>({
    provider: { value: 'paystack', text: 'Paystack' },
    expiry_date: { value: endOfTomorrow().getTime(), text: 'Tomorrow' },
  });
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequestSchema>(
    INITIAL_PAYMENT_REQUEST,
  );
  const [commentAttachedFiles, setCommentAttachedFiles] = useState<File[]>([]);

  const threadRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: mutateSendMessage } = useMutation<any, AxiosError, any, any>(
    (payload: any) => sendMessage(payload),
    {
      onMutate: async data => {
        const { body, body_html, from, bcc, cc, type, files, subject, content_type } = data;
        const newMessage = {
          type,
          meta: {
            cc: cc ? JSON.parse(cc) : [],
            bcc: bcc ? JSON.parse(bcc) : [],
          },
          content: {
            body,
            subject,
            body_html,
            content_type,
          },
          attachments: files,
          author: {
            uuid: user_id,
            is_customer: false,
            platform_nick: from,
            name: `${profile?.first_name} ${profile?.last_name}`,
          },
        };
        await queryClient.cancelQueries(['messages', thread.uuid]);
        const previousMessages = queryClient.getQueryData(['messages', thread.uuid]);
        queryClient.setQueryData(['messages', thread.uuid], old => ({
          //@ts-ignore
          ...old,
          //@ts-ignore
          pages: old.pages.map(page => {
            if (page.meta.page === 1) {
              return {
                ...page,
                messages: [newMessage, ...page.messages],
              };
            }
            return page;
          }),
        }));

        // Return a context object with the snapshotted value
        return { previousMessages };
      },
      onError: error => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              onClose={onClose}
              message={error.message ?? 'Error! Failed to send the message'}
            />
          ),
        });
      },
      onSuccess: (data, variables) => {
        sendAmplitudeData('send-message', variables);
        queryClient.invalidateQueries(['messages', thread.uuid]);
        queryClient.invalidateQueries('threads');
      },
    },
  );

  const { mutate: onAddToContactList } = useMutation<any, AxiosError, any, any>(
    ({ columns, table_id }) => createRow({ columns, table_id }),
    {
      onError: error => {
        toast({
          position: 'bottom-left',
          render: () => <ToastBox message={error.message} />,
        });
      },
    },
  );

  const { mutate: mutateStartThread } = useMutation<any, AxiosError, any, any>(
    (payload: any) => startThread(payload),
    {
      onSuccess: (data, variables) => {
        setActiveFilter?.();
        setActiveThread?.(data.thread);
        setTwoWayPayload({
          contactName: '',
          contact_id: undefined,
          senderPlatformNick: '',
        });

        if (variables.user_nick) {
          const columns = getContactRowData(variables);
          onAddToContactList({ columns, table_id: contactList.id });
        }
        sendAmplitudeData('new-message', variables);
      },
      onError: error => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              onClose={onClose}
              message={error.message ?? 'Error! Failed to send message'}
            />
          ),
        });
      },
    },
  );

  const { isLoading: isCreatingLink, mutate: mutateSendPaymentRequest } = useMutation<
    any,
    AxiosError,
    any,
    any
  >(({ payload }: any) => sendPaymentRequest(payload), {
    onError: error => {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message={error.message ?? 'Error! Failed to send payment request'}
          />
        ),
      });
    },
    onSuccess: (data, variables) => {
      setIsModalOpened(false);
      if (variables.callback) {
        variables.callback();
      } else {
        setPaymentRequest(INITIAL_PAYMENT_REQUEST);
      }
      if (isNewConversation) {
        setActiveFilter?.();
        setActiveThread?.(data.thread);
      } else {
        queryClient.invalidateQueries(['messages', thread.uuid]);
        queryClient.invalidateQueries('threads');
      }
      sendAmplitudeData('send-payment-request', variables.payload);
    },
  });

  const { mutate: closeMutate } = useMutation<any, AxiosError, any, any>(
    (thread: ThreadSchema) => resolveConversationThread(thread),
    {
      onMutate: async newThread => {
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: newThread => {
        queryClient.invalidateQueries(['threads', newThread.uuid]);
      },
    },
  );

  const getContactRowData = (data: any) => {
    const nameColumn = contactList.columns.find((item: any) => item.name.toLowerCase() === 'name');
    const phoneNumberColumn = contactList.columns.find(
      (item: any) => item.type.toLowerCase() === 'phone number',
    );
    const emailColumn = contactList.columns.find(
      (item: any) => item.type.toLowerCase() === 'email',
    );

    let columns = {
      [nameColumn.id]: data?.contact_name,
    };

    if (channel_name === 'email' && emailColumn) {
      columns[emailColumn.id] = data?.user_nick;
    }
    if (
      phoneNumberColumn &&
      (channel_name === 'phone' || channel_name === 'whatsapp' || channel_name === 'whatsappWeb')
    ) {
      columns[phoneNumberColumn.id] = data?.user_nick;
    }

    return columns;
  };

  const handleTextChange = (text: string, isTemplateMode?: boolean) => {
    setText(html2Text(text));
    // setIsTemplateMode(!!isTemplateMode);
    textAreaRef.current?.focus();
  };

  const handleSendMessage = async (payload?: any) => {
    const { type, body: bodyText, ...rest } = payload;
    const body = html2Text(bodyText);
    const body_html = channel_name === 'email' ? bodyText : undefined;
    const data = { ...rest, body, body_html };

    if (isNewConversation) {
      mutateStartThread(data);
    } else {
      mutateSendMessage(data);
    }
  };

  const handleSendComment = (payload?: { body?: string; thread_id?: string; files?: File[] }) => {
    const body = html2Text(payload?.body ?? '');
    const data = { ...payload, body, type: 'comment' };

    mutateSendMessage(data);
    sendAmplitudeData('send-comment', data);
  };

  const handleSendPaymentRequest = (paymentRequest: any, callback?: () => void) => {
    const { credential_id, senderPlatformNick } = twoWayPayload;
    let payload: any = {
      request: {
        ...paymentRequest,
        items: paymentRequest.items.map(({ amount, ...rest }: any) => ({
          ...rest,
          amount_unit: parseFloat(amount),
        })),
      },
    };
    if (isNewConversation) {
      payload = {
        ...payload,
        credential_id,
        user_nick: senderPlatformNick,
        receiver_id: thread.receiver.uuid,
      };
    } else {
      payload = {
        ...payload,
        thread_id: thread.uuid,
      };
    }
    mutateSendPaymentRequest({ payload, callback });
  };

  const handleSendAndClose = (payload: any) => {
    try {
      if (thread) {
        mutateSendMessage(payload);
        closeMutate({ ...thread, state: 'resolved' });
        sendAmplitudeData('close-conversation');
      }
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  useEffect(() => {
    setIsTemplateMode(isTemplateModeProp ?? false);
  }, [isTemplateModeProp]);

  useEffect(() => {
    if (textAreaRef.current && !isNewConversation) {
      textAreaRef.current.focus();
    }
    setText('');
  }, [thread, isNewConversation]);

  useEffect(() => {
    if (isNewConversation) {
      setText(textProp ?? '');
    }
  }, [textProp, isNewConversation]);

  return (
    <Stack spacing="1.5rem">
      {channel_name !== 'email' ? (
        <Box>
          <MessageComposeForm
            text={text}
            thread={thread}
            threadRef={threadRef}
            textAreaRef={textAreaRef}
            setText={handleTextChange}
            onSubmit={handleSendMessage}
            twoWayPayload={twoWayPayload}
            isModalOpened={isModalOpened}
            isTemplateMode={isTemplateMode}
            isCreatingLink={isCreatingLink}
            sendAndClose={handleSendAndClose}
            setIsModalOpened={setIsModalOpened}
            setTwoWayPayload={setTwoWayPayload}
            setIsTemplateMode={setIsTemplateMode}
            currentThreadID={currentThreadID ?? 'new'}
            onSendPaymentRequest={handleSendPaymentRequest}
          />
        </Box>
      ) : (
        showEmailCompose && (
          <Box>
            <EmailMessageCompose
              thread={thread}
              channel={channel_name}
              sender_id={sender_id ?? ''}
              onSubmit={handleSendMessage}
              twoWayPayload={twoWayPayload}
              sendAndClose={handleSendAndClose}
              onCloseCompose={onCloseEmailCompose}
              initialValues={{
                text,
                subject: isNewConversation ? '' : lastMessage?.content?.subject,
                cc: isNewConversation ? undefined : lastMessage?.meta?.cc?.join(', '),
                to: isNewConversation ? receiver.platform_nick : sender?.platform_nick,
                bcc: isNewConversation ? undefined : lastMessage?.meta?.bcc?.join(', '),
                from: isNewConversation ? sender.platform_nick : receiver?.platform_nick,
              }}
              requestProps={{
                paymentItems,
                isModalOpened,
                isCreatingLink,
                paymentRequest,
                paymentLinkMeta,
                setPaymentItems,
                setIsModalOpened,
                setPaymentRequest,
                setPaymentLinkMeta,
                onSendPaymentRequest: handleSendPaymentRequest,
              }}
            />
          </Box>
        )
      )}
      {!isNewConversation && (
        <Box>
          <CommentCompose
            thread={thread}
            text={commentText}
            setText={setCommentText}
            onSubmit={handleSendComment}
            attachedFiles={commentAttachedFiles}
            setAttachedFiles={setCommentAttachedFiles}
            mentions={otherOrgMembers.map(item => ({
              name: `${item.first_name} ${item.last_name}`,
            }))}
          />
        </Box>
      )}
    </Stack>
  );
};
