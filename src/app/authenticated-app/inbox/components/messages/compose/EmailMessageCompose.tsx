import { Box, Flex, Icon, Stack } from '@chakra-ui/core';
import {
  ComposeIconsProps,
  ThreadSchema,
  TwoWayPayloadSchema,
} from 'app/authenticated-app/inbox/inbox.types';
import { html2Text } from 'app/authenticated-app/marketing/templates/templates.utils';
import { Button, Input, Menu, MenuItem, SmallText } from 'app/components';
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import draftToHtml from 'draftjs-to-html';
import { IEmojiData } from 'emoji-picker-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useInbox } from '../../Provider';
import { Attachments } from './Attachments';
import {
  BlockStyleControls,
  DraftEditor,
  DraftEditorContainer,
  InlineStyleControls,
} from './DraftEditor';
import { Emoji } from './Emoji';
import { FilePicker } from './FilePicker';
import { Request } from './Request';
import { Template } from './Template';

type EmailMessageComposeProps = {
  channel?: string;
  sender_id: string;
  thread: ThreadSchema;
  onCloseCompose?(): void;
  twoWayPayload?: TwoWayPayloadSchema;
  onSubmit?(payload?: any, callback?: () => void): void;
  sendAndClose?(payload?: any, callback?: () => void): void;
  requestProps: Pick<
    ComposeIconsProps,
    | 'paymentItems'
    | 'setPaymentItems'
    | 'isModalOpened'
    | 'setIsModalOpened'
    | 'paymentLinkMeta'
    | 'setPaymentLinkMeta'
    | 'paymentRequest'
    | 'setPaymentRequest'
    | 'isCreatingLink'
    | 'onSendPaymentRequest'
  >;
  initialValues?: {
    cc?: string;
    bcc?: string;
    from?: string;
    text?: string;
    subject?: string;
    to?: string | string[];
  };
};

export const EmailMessageCompose = (props: EmailMessageComposeProps) => {
  const {
    thread,
    channel,
    onSubmit,
    sender_id,
    sendAndClose,
    requestProps,
    twoWayPayload,
    initialValues,
    onCloseCompose,
  } = props;
  const {
    to: toProp,
    cc: ccProp,
    bcc: bccProp,
    text: textProp,
    from: fromProp,
    subject: subjectProp,
  } = initialValues ?? {};

  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [from, setFrom] = useState<string | undefined>(fromProp || '');
  const [to, setTo] = useState<string | string[] | undefined>(toProp || '');
  const [cc, setCC] = useState<string | undefined>(ccProp || '');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [bcc, setBCC] = useState<string | undefined>(bccProp || '');
  const [subject, setSubject] = useState<string | undefined>(subjectProp || '');

  const editorRef = useRef<any>(null);
  const { isNewConversation } = useInbox();

  const handleFromChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value);
  };

  const handleCCChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCC(e.target.value);
  };

  const handleBCCChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBCC(e.target.value);
  };

  const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleTemplateChange = (text: string, isTemplateMode?: boolean, subject?: string) => {
    const blocksFromHTML = convertFromHTML(text);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    setSubject(subject);
    setEditorState(EditorState.moveFocusToEnd(EditorState.createWithContent(contentState)));
  };

  const handleEmojiClick = (event: MouseEvent, emojiObject: IEmojiData) => {
    const currentContent = editorState.getCurrentContent(),
      currentSelection = editorState.getSelection();

    const newContent = Modifier.replaceText(currentContent, currentSelection, emojiObject.emoji);

    const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');

    setEditorState(EditorState.forceSelection(newEditorState, newContent.getSelectionAfter()));
  };

  const handleClearState = () => {
    onCloseCompose?.();
    setCC('');
    setBCC('');
    setSubject('');
    setShowCC(false);
    setShowBCC(false);
    setAttachedFiles([]);
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmit = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const text =
      rawContentState &&
      draftToHtml(rawContentState, {
        trigger: '#',
        separator: ' ',
      });

    let payload: any = {
      to,
      from,
      subject,
      type: 'message',
      body_html: text,
      content_type: 'html',
      files: attachedFiles,
      body: html2Text(text),
      thread_id: thread.uuid,
      cc: JSON.stringify(cc?.split(',')),
      bcc: JSON.stringify(bcc?.split(',')),
    };

    if (isNewConversation) {
      const { contact_id, contactName, senderPlatformNick, credential_id } = twoWayPayload ?? {};
      payload = {
        ...payload,
        contact_id,
        credential_id,
        contact_name: contactName,
        user_nick: senderPlatformNick,
      };
    }
    onSubmit?.(payload);
    handleClearState();
  };

  const handleSendAndClose = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const text =
      rawContentState &&
      draftToHtml(rawContentState, {
        trigger: '#',
        separator: ' ',
      });

    let payload: any = {
      to,
      from,
      subject,
      type: 'message',
      body_html: text,
      content_type: 'html',
      files: attachedFiles,
      body: html2Text(text),
      thread_id: thread.uuid,
      cc: JSON.stringify(cc?.split(',')),
      bcc: JSON.stringify(bcc?.split(',')),
    };

    if (isNewConversation) {
      const { contact_id, contactName, senderPlatformNick, credential_id } = twoWayPayload ?? {};
      payload = {
        ...payload,
        contact_id,
        credential_id,
        contact_name: contactName,
        user_nick: senderPlatformNick,
      };
    }
    sendAndClose?.(payload);
    handleClearState();
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setTo(toProp);
  }, [toProp]);

  useEffect(() => {
    setFrom(fromProp);
  }, [fromProp]);

  useEffect(() => {
    setCC(ccProp);
  }, [ccProp]);

  useEffect(() => {
    setBCC(bccProp);
  }, [bccProp]);

  useEffect(() => {
    setSubject(subjectProp);
  }, [subjectProp]);

  useEffect(() => {
    handleTemplateChange(textProp ?? '', undefined, subjectProp);
  }, [textProp, subjectProp]);

  return (
    <Box
      py="1rem"
      borderRadius="8px"
      paddingLeft="1.25rem"
      paddingRight="1.5625rem"
      border="1px solid rgb(228, 233, 240)"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <Stack spacing="0.25rem" isInline alignItems="center">
            <SmallText color="gray.400">From:</SmallText>
            <Input
              size="sm"
              minW="100px"
              value={from}
              borderWidth="0"
              _hover={{ borderWidth: '0' }}
              _focus={{ borderWidth: '0' }}
              _active={{ borderWidth: '0' }}
              onChange={handleFromChange}
            />
          </Stack>
          <Stack spacing="0.25rem" isInline alignItems="center">
            <SmallText color="gray.400">To:</SmallText>
            <Input
              size="sm"
              value={to}
              minW="100px"
              borderWidth="0"
              _hover={{ borderWidth: '0' }}
              _focus={{ borderWidth: '0' }}
              _active={{ borderWidth: '0' }}
              onChange={handleToChange}
            />
          </Stack>
        </Stack>
        <Stack isInline alignItems="center">
          {!(showCC || cc) && (
            <Button
              size="xs"
              variant="ghost"
              color="gray.500"
              fontWeight="normal"
              fontSize="0.875rem"
              onClick={() => setShowCC(true)}
            >
              CC
            </Button>
          )}
          {!(showBCC || bcc) && (
            <Button
              size="xs"
              variant="ghost"
              color="gray.500"
              fontWeight="normal"
              fontSize="0.875rem"
              onClick={() => setShowBCC(true)}
            >
              BCC
            </Button>
          )}
        </Stack>
      </Flex>
      <Stack spacing="0.25rem" isInline alignItems="center">
        <SmallText color="gray.400">Subject:</SmallText>
        <Input
          size="sm"
          value={subject}
          minW="100px"
          borderWidth="0"
          _hover={{ borderWidth: '0' }}
          _focus={{ borderWidth: '0' }}
          _active={{ borderWidth: '0' }}
          onChange={handleSubjectChange}
        />
      </Stack>
      <Box>
        {(showCC || cc) && (
          <Stack width="100%" spacing="0.25rem" isInline alignItems="center">
            <SmallText color="gray.400">CC:</SmallText>
            <Input
              size="sm"
              value={cc}
              borderWidth="0"
              _hover={{ borderWidth: '0' }}
              _focus={{ borderWidth: '0' }}
              _active={{ borderWidth: '0' }}
              onChange={handleCCChange}
            />
          </Stack>
        )}
        {(showBCC || bcc) && (
          <Stack width="100%" spacing="0.25rem" isInline alignItems="center">
            <SmallText color="gray.400">BCC:</SmallText>
            <Input
              size="sm"
              value={bcc}
              borderWidth="0"
              _hover={{ borderWidth: '0' }}
              _focus={{ borderWidth: '0' }}
              _active={{ borderWidth: '0' }}
              onChange={handleBCCChange}
            />
          </Stack>
        )}
      </Box>
      <Attachments files={attachedFiles} setFiles={setAttachedFiles} />
      <DraftEditorContainer>
        <Box height="150px">
          <DraftEditor ref={editorRef} editorState={editorState} onChange={setEditorState} />
        </Box>
        <Flex alignItems="center" justifyContent="space-between">
          <Stack spacing="1rem" isInline alignItems="center">
            <Box>
              <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
            </Box>
            <Box>
              <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
            </Box>
          </Stack>
          <Flex justifyContent="flex-end" alignItems="center">
            <Stack spacing="1rem" isInline alignItems="center">
              <Template setText={handleTemplateChange} sender_id={sender_id} />
              <Emoji onEmojiClick={handleEmojiClick} />
              <Request {...requestProps} />
              <FilePicker channel={channel} files={attachedFiles} setFiles={setAttachedFiles} />
              <Button size="xs" variant="ghost" onClick={handleClearState}>
                <Icon name="inbox-compose-trash" size="16px" />
              </Button>
            </Stack>
            <Flex pl="0.5rem">
              <Button
                size="sm"
                roundedRight="0"
                variantColor="blue"
                onClick={handleSubmit}
                roundedTopLeft="100px"
                roundedBottomLeft="100px"
                //@ts-ignore
                leftIcon="inbox-compose-send"
                isDisabled={!editorState.getCurrentContent().hasText() || attachedFiles.length > 0}
              >
                Send
              </Button>
              <Menu
                renderItem={option => <MenuItem key={Date.now().toString()} {...option} />}
                menuButtonProps={{
                  as: Button,
                  size: 'sm',
                  roundedLeft: '0',
                  //@ts-ignore
                  variantColor: 'blue',
                  roundedTopRight: '100px',
                  roundedBottomRight: '100px',
                  _focus: { boxShadow: 'none' },
                  children: <Icon name="chevron-down" />,
                  isDisabled:
                    !editorState.getCurrentContent().hasText() || attachedFiles.length > 0,
                }}
                options={[{ children: 'Send and close', onClick: handleSendAndClose }]}
              />
            </Flex>
          </Flex>
        </Flex>
      </DraftEditorContainer>
    </Box>
  );
};
