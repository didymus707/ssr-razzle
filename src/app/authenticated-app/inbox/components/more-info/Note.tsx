import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  IconButton,
  Spinner,
  Stack,
  StackProps,
  Text,
  useToast,
} from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../root';
import {
  fetchThreadNotes,
  selectNoteById,
  selectThreadNoteIDs,
  sendThreadNote,
  selectNoteMetaByThreadID,
} from '../../slices';
import { NoteSchema } from '../../inbox.types';
import { selectOrgMemberByID } from '../../../settings/slices';
import { INBOX_INIT } from '../../inbox.data';
import { formatMessageDateTime } from '../../inbox.utils';
import { Editor } from '../messages';
import { ToastBox } from '../../../../components';
import InfiniteScroll from 'react-infinite-scroll-component';

function NoteItemAuthor({
  author_id,
  created_datetime,
  children,
  ...props
}: Pick<NoteSchema, 'author_id' | 'created_datetime'> & StackProps) {
  const { first_name, last_name } = useSelector((state: RootState) =>
    selectOrgMemberByID(state, author_id),
  ) || { id: '', first_name: '', last_name: '' };

  const authorName = `${first_name} ${last_name}`;

  return (
    <Stack isInline marginTop=".625rem" spacing=".625rem" alignItems="flex-start" {...props}>
      <Avatar size="2xs" name={authorName} />

      <Box>
        <Stack isInline color="#828282" spacing=".5rem">
          <Text>{authorName}</Text>
          <Text>
            {`- ${formatMessageDateTime(
              created_datetime ? new Date(created_datetime) : new Date(),
            )}`}
          </Text>
        </Stack>

        {children}
      </Box>
    </Stack>
  );
}

function NoteItem({ noteID }: { noteID: NoteSchema['uuid'] }) {
  const { author_id, created_datetime, content } =
    useSelector((state: RootState) => selectNoteById(state, noteID)) || INBOX_INIT.note;

  return (
    <NoteItemAuthor author_id={author_id} created_datetime={created_datetime}>
      <Text color="#333" marginTop=".5rem">
        {content}
      </Text>
    </NoteItemAuthor>
  );
}

export function Note({ ...props }: BoxProps) {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const toast = useToast();
  const [hasMore, setHasMore] = useState(true);
  const noteIDs = useSelector((state: RootState) =>
    selectThreadNoteIDs(state, { thread_id: params.id }),
  );
  const meta = useSelector((state: RootState) =>
    selectNoteMetaByThreadID(state, { thread_id: params.id }),
  );

  const handleSubmit = async () => {
    if (text.trim() && params.id !== 'start') {
      try {
        await dispatch(
          sendThreadNote({
            content: text,
            thread_id: params.id,
          }),
        );
        setText('');
      } catch (message) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
        });
      }
    }
  };

  const fetchMoreData = () => {
    const { count = 0, page = 0 } = (meta || {} as any);
    if (count !== 0 && Math.ceil(count / 15 - page) === 0) {
      return setHasMore(false);
    }

    return (
      params.id &&
      params.id !== 'start' &&
      dispatch(
        fetchThreadNotes({
          page: page + 1,
          thread_id: params.id,
        }),
      )
    );
  };

  // fetch the conversation messages
  useEffect(() => {
    setHasMore(true);
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    setText('');
  }, [params.id]);

  return (
    <Flex flexDirection="column" flex={1} className="notes-container" overflowY="hidden" {...props}>
      {noteIDs.length > 0 && (
        <Stack
          flexDirection="column-reverse"
          overflowY="auto"
          flex={1}
          className="notes"
          id="note-scrollable"
          marginTop=".75rem"
          fontSize=".75rem"
          lineHeight="1rem"
        >
          <InfiniteScroll
            dataLength={noteIDs.length}
            next={fetchMoreData}
            hasMore={hasMore}
            inverse={true}
            scrollableTarget="note-scrollable"
            loader={
              <Box textAlign="center" paddingTop="2rem">
                <Spinner color="blue.500" size="md" />
              </Box>
            }
            style={{
              flex: 1,
              display: 'flex',
              paddingRight: '1.5rem',
              flexDirection: 'column-reverse',
            }}
          >
            {noteIDs.map(noteID => (
              <NoteItem key={noteID} noteID={noteID} />
            ))}
          </InfiniteScroll>
        </Stack>
      )}

      <Box className="editor" position="relative" marginRight="1.5rem">
        <IconButton
          // @ts-ignore
          icon="send"
          aria-label="send-note"
          variant="ghost"
          color="#333"
          padding=".25rem"
          position="absolute"
          height="auto"
          minWidth="auto"
          bottom="0.90625rem"
          right=".375rem"
          isDisabled={!text.trim()}
          onClick={handleSubmit}
        />

        <Editor
          setText={setText}
          handleSubmit={handleSubmit}
          textAreaRef={textAreaRef}
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          placeholder="Write a note..."
          style={{
            backgroundColor: '#f2f2f2',
            borderRadius: '3px',
            width: '100%',
            marginTop: '1rem',
            padding: '.625rem .5rem',
            resize: 'none',
          }}
        />
      </Box>
    </Flex>
  );
}
