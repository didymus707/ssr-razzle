import { Avatar, Box, Flex, Icon, Stack } from '@chakra-ui/core';
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
  MentionPluginTheme,
} from '@draft-js-plugins/mention';
import { ComposeIconsProps, ThreadSchema } from 'app/authenticated-app/inbox/inbox.types';
import { Button, SmallText } from 'app/components';
import { convertToRaw, EditorState, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { IEmojiData } from 'emoji-picker-react';
import React, { MouseEvent, ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { Attachments } from './Attachments';
import { DraftEditor, DraftEditorContainer } from './DraftEditor';
import { Emoji } from './Emoji';
import { FilePicker } from './FilePicker';
import { MessageComposeFormProps } from './MessageCompose';

export type CommentComposeProps = Pick<
  ComposeIconsProps,
  'setText' | 'attachedFiles' | 'setAttachedFiles'
> & {
  thread: ThreadSchema;
  mentions?: MentionData[];
  text: MessageComposeFormProps['text'];
  onSubmit?(
    payload?: { body?: string; thread_id?: string; files?: File[] },
    callback?: () => void,
  ): void;
};

export const CommentCompose = (props: CommentComposeProps) => {
  const { text, thread, mentions, setText, onSubmit, attachedFiles, setAttachedFiles } = props;

  const editorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(
    ({ value }: { value: string }) => {
      setSuggestions(defaultSuggestionsFilter(value, mentions ?? []));
    },
    [mentions],
  );

  const handleChange = (editorState: EditorState) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const text =
      rawContentState &&
      draftToHtml(rawContentState, {
        trigger: '#',
        separator: ' ',
      });
    setEditorState(editorState);
    setText(text);
  };

  const handleFocus = () => {
    if (editorRef.current) {
      editorRef?.current?.focus();
    }
  };

  const handleEmojiClick = (event: MouseEvent, emojiObject: IEmojiData) => {
    const currentContent = editorState.getCurrentContent(),
      currentSelection = editorState.getSelection();

    const newContent = Modifier.replaceText(currentContent, currentSelection, emojiObject.emoji);

    const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');

    setEditorState(EditorState.forceSelection(newEditorState, newContent.getSelectionAfter()));
  };

  const handleSendMessageSuccess = () => {
    setText('');
    setAttachedFiles([]);
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmit = () => {
    onSubmit?.({ body: text, files: attachedFiles, thread_id: thread.uuid });
    handleSendMessageSuccess();
  };

  return (
    <Flex width="100%" borderTopWidth="1px" alignItems="center" justifyContent="space-between">
      <Box flex={1}>
        <Attachments files={attachedFiles} setFiles={setAttachedFiles} />
        <DraftEditorContainer minHeight="unset" onClick={handleFocus}>
          <DraftEditor
            ref={editorRef}
            plugins={plugins}
            editorKey={'editor'}
            onChange={handleChange}
            editorState={editorState}
            placeholder="Type an internal comment"
          />
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            entryComponent={MentionEntry}
            suggestions={suggestions ?? []}
            onSearchChange={onSearchChange}
            onAddMention={() => {
              // get the mention object selected
            }}
          />
        </DraftEditorContainer>
      </Box>
      <Stack spacing="0" isInline alignItems="center">
        <Box>
          <Emoji
            onEmojiClick={handleEmojiClick}
            iconProps={{
              size: '20px',
              color: '#74798F',
              name: 'inbox-comment-compose-emoji',
            }}
          />
        </Box>
        <Box>
          <FilePicker
            files={attachedFiles}
            textAreaRef={editorRef}
            setFiles={setAttachedFiles}
            iconProps={{
              size: '20px',
              color: '#74798F',
              name: 'inbox-comment-compose-file',
            }}
          />
        </Box>
        <Box>
          <Button size="xs" variant="ghost" variantColor="blue" onClick={handleSubmit}>
            <Icon name="inbox-comment-send" size="16px" />
          </Button>
        </Box>
      </Stack>
    </Flex>
  );
};

export interface EntryComponentProps {
  id: string;
  role: string;
  isFocused: boolean;
  className?: string;
  searchValue?: string;
  mention: MentionData;
  theme?: MentionPluginTheme;
  onMouseDown(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onMouseEnter(event: MouseEvent): void;
  'aria-selected'?: boolean | 'false' | 'true';
}

function MentionEntry(props: EntryComponentProps): ReactElement {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props;

  return (
    <Box {...parentProps}>
      <Stack isInline alignItems="center">
        <Avatar size="xs" name={mention.name} src={mention.avatar} role="presentation" />
        <SmallText color="gray.900">{mention.name}</SmallText>
      </Stack>
    </Box>
  );
}
