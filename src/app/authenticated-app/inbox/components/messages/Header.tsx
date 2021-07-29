import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Flex,
  Grid,
  IconButton,
  Input,
  Modal,
  Text,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Radio,
  Stack,
  StackProps,
  useToast,
  Icon,
  ButtonProps,
  IconProps,
  Textarea,
} from '@chakra-ui/core';
import React, { useState, useRef, RefObject, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { RootState } from '../../../../../root';
import { ConfirmModal, ToastBox } from '../../../../components';
import { selectProfile, selectUserID } from '../../../../unauthenticated-app/authentication';
import { selectCredentialById } from '../../../channels';
import { TeamMember } from '../../../settings/settings.types';
import { selectOtherOrgMembers } from '../../../settings/slices';
import { INBOX_INIT } from '../../inbox.data';
import { MessageHeaderProps } from '../../inbox.types';
import {
  assignThread,
  resolveThread,
  selectAssignmentsByThreadID,
  selectCustomerById,
  selectCustomerByID,
  selectThreadDetailByID,
  sendThreadNote,
  selectContactTableID,
  selectName,
} from '../../slices';

function Left({
  sender_id,
  receiver_id,
  ...props
}: BoxProps & Pick<MessageHeaderProps, 'sender_id' | 'receiver_id'>) {
  const receiver = useSelector((state: RootState) => selectCredentialById(state, receiver_id));
  const { platform_name: receiverName } =
    useSelector((state: RootState) => selectCustomerById(state, receiver?.user_id || '')) ||
    INBOX_INIT.customer;

  const sender_name = useSelector((state: RootState) =>
    selectName(state, 
      { 
        id: sender_id,
        // @ts-ignore
        credentialUserID: receiver?.user_id 
      }),
  );

  return (
    <Box {...props}>
      {sender_name && (
        <Text pb="0.5rem" fontWeight={600} lineHeight={1} fontSize="1.25rem">
          {sender_name}
        </Text>
      )}

      {receiverName && (
        <Text color="#828282" fontSize=".875rem" lineHeight=".875rem">
          {receiverName}
        </Text>
      )}
    </Box>
  );
}

function InternalModal({ isModalOpened, setIsModalOpened, ...props }: any) {
  const closeModal = () => setIsModalOpened(false);

  return (
    <Modal
      isCentered
      size="xl"
      isOpen={isModalOpened}
      onClose={closeModal}
      closeOnOverlayClick={false}
      {...props}
    >
      <ModalOverlay />
      <ModalContent
        width="auto"
        paddingTop="2rem"
        borderRadius=".3125rem"
        boxShadow="0px 0px 1px rgba(67, 90, 111, 0.47)"
      >
        <ModalCloseButton size="sm" />

        {props.children}
      </ModalContent>
    </Modal>
  );
}

function Assign({
  currentThreadID,
  isModalOpened,
  setIsModalOpened,
  ...props
}: BoxProps & {
  currentThreadID: string;
  isModalOpened: boolean;
  setIsModalOpened: (v: boolean) => void;
}) {
  const [radioText, setRadioText] = useState('Unassign');
  const [search, setSearch] = useState('');
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const initialFocusRef = useRef<HTMLElement>();
  const dispatch = useDispatch();
  const toast = useToast();

  const user_id = useSelector(selectUserID);
  const otherOrgMembers = useSelector((state: RootState) =>
    selectOtherOrgMembers(state, { user_id: user_id || '' }),
  );

  let members: TeamMember[] = otherOrgMembers.filter(
    ({ first_name, last_name }) =>
      first_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      last_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  const handleMemberSelected = async () => {
    const selectedMember = members.find(({ id }) => id === radioText);

    if (selectedMember) {
      setAssignmentLoading(true);

      try {
        await dispatch(
          assignThread({
            thread_id: currentThreadID,
            assignee_id: selectedMember.id,
          }),
        );
      } catch (error) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }

      setAssignmentLoading(false);
    }

    setIsModalOpened(false);
  };

  const handleModalClose = (value: boolean) => {
    setSearch('');
    setIsModalOpened(value);
  };

  return (
    <InternalModal
      isModalOpened={isModalOpened}
      setIsModalOpened={handleModalClose}
      initialFocusRef={initialFocusRef}
    >
      <Box
        paddingX="1.5rem"
        paddingBottom="1.25rem"
        minWidth={['300px', '393px', '393px', '393px']}
      >
        <Text fontWeight={500} fontSize="1.25rem" lineHeight="1.625rem" color="#000">
          Assign To
        </Text>

        <Input
          marginTop="1.25rem"
          lineHeight="1rem"
          borderRadius="3px"
          fontSize=".8675rem"
          padding=".625rem 1rem"
          backgroundColor="#f2f2f2"
          // @ts-ignore
          ref={initialFocusRef}
          placeholder="Search users"
          _placeholder={{ color: 'rgba(51, 51, 51, 0.5)' }}
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />

        <Stack marginTop="1rem" spacing="1rem">
          {members.map(({ id, first_name, last_name }, index) => (
            <Flex key={id} alignItems="center">
              <Avatar name={`${first_name} ${last_name}`} size="sm" />

              <Text
                color="#000"
                fontWeight={600}
                lineHeight="1.25rem"
                fontSize="1rem"
                marginLeft="1rem"
                marginRight="auto"
              >
                {`${first_name} ${last_name}`}
              </Text>

              <Radio
                onChange={() => setRadioText(id)}
                name="assign-to"
                value={id}
                size="md"
                isChecked={radioText === id}
              />
            </Flex>
          ))}
        </Stack>

        <Stack
          isInline
          spacing=".5rem"
          marginTop="2rem"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            variant="ghost"
            variantColor="blue"
            color="#828282"
            fontSize=".75rem"
            padding=".25rem .625rem"
            height="auto"
            onClick={() => setIsModalOpened(false)}
          >
            Cancel
          </Button>

          <Button
            variant="solid"
            variantColor="blue"
            fontSize=".75rem"
            padding=".25rem .625rem"
            height="auto"
            onClick={() => handleMemberSelected()}
            loadingText="Assigning"
            isLoading={assignmentLoading}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </InternalModal>
  );
}

function Note({
  isModalOpened,
  setIsModalOpened,
  ...props
}: BoxProps & {
  isModalOpened: boolean;
  setIsModalOpened: (v: boolean) => void;
}) {
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const initialFocusRef = useRef<HTMLElement>();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const toast = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (note.trim() && params.id !== 'start') {
      setIsSending(true);
      try {
        await dispatch(
          sendThreadNote({
            content: note,
            thread_id: params.id,
          }),
        );
        setNote('');
      } catch (message) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
        });
      }
      setIsSending(false);
    }
  };

  const handleModalClose = (value: boolean) => {
    if (!value) {
      setNote('');
    }

    setIsModalOpened(value);
  };

  return (
    <InternalModal
      isModalOpened={isModalOpened}
      setIsModalOpened={handleModalClose}
      initialFocusRef={initialFocusRef}
    >
      <Box padding="1.25rem" minWidth="300px">
        <Text
          color="#000"
          fontSize="1.25rem"
          fontWeight={500}
          lineHeight="1.6125rem"
          marginBottom=".625rem"
        >
          Add Note
        </Text>

        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add an internal note to give more context to this conversation...."
            resize="none"
            fontSize=".8675rem"
            lineHeight="1rem"
            padding=".5rem .625rem"
            value={note}
            border="1px solid #0015FF"
            // @ts-ignores
            ref={initialFocusRef}
            onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => setNote(value)}
          />

          <Stack isInline marginTop="1.375rem" spacing=".625rem" justifyContent="flex-end">
            <Button
              type="button"
              variant="ghost"
              variantColor="blue"
              fontSize=".875rem"
              marginTop=".5rem"
              paddingX=".625rem"
              onClick={() => handleModalClose(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="solid"
              variantColor="blue"
              fontSize=".875rem"
              color="white"
              marginTop=".5rem"
              paddingX=".625rem"
              isLoading={isSending}
              loadingText="Adding Note"
            >
              Add Note
            </Button>
          </Stack>
        </form>
      </Box>
    </InternalModal>
  );
}

function Resolve({
  user_id,
  thread_id,
  isModalOpened,
  setIsModalOpened,
  ...props
}: BoxProps & {
  user_id?: string;
  thread_id: string;
  isModalOpened: boolean;
  setIsModalOpened: (v: boolean) => void;
}) {
  const history = useHistory();
  const toast = useToast();
  const dispatch = useDispatch();

  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const handleThreadResolve = async (thread_id: string, receiver_id: string) => {
    try {
      if (thread_id && receiver_id) {
        setIsBtnLoading(true);

        await dispatch(resolveThread({ thread_id }));

        setIsModalOpened(false);
        setIsBtnLoading(false);
        history.push('/s/inbox');
      }
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  return (
    <ConfirmModal
      isOpen={isModalOpened}
      onClose={() => setIsModalOpened(false)}
      title="Resolve conversation"
      isLoading={isBtnLoading}
      onConfirm={() => handleThreadResolve(thread_id || '', user_id || '')}
    />
  );
}

function MenuItem({
  initialFocusRef,
  icon,
  text,
  ...props
}: Omit<ButtonProps, 'children'> & {
  icon: IconProps['name'];
  text: string;
  initialFocusRef?: RefObject<HTMLElement> | null;
}) {
  return (
    <Button
      {...props}
      variant="ghost"
      variantColor="blue"
      color="#333"
      fontSize=".8675rem"
      fontWeight="normal"
      lineHeight="1rem"
      minWidth="auto"
      alignItems="center"
      padding=".5rem"
      marginLeft="-.5rem"
      justifyContent="start"
      ref={initialFocusRef}
    >
      <Icon name={icon} size="1rem" />
      <Text marginLeft=".5rem">{text}</Text>
    </Button>
  );
}

function More({
  sender_id,
  canAssign,
  canResolve,
  openAssignModal,
  openNoteModal,
  openResolveModal,
  ...props
}: PopoverProps & {
  sender_id: string;
  canAssign: boolean;
  canResolve: boolean;
  openAssignModal: () => void;
  openResolveModal: () => void;
  openNoteModal: () => void;
}) {
  // const history = useHistory();
  const initialFocusRef = useRef<HTMLElement>(null);

  const { platform_name: sender_name } =
    useSelector((state: RootState) => selectCustomerByID(state, sender_id)) || INBOX_INIT.customer;
  const contactTableID = useSelector(selectContactTableID);

  const actions = [
    { icon: 'template', text: 'Add Notes', onClick: openNoteModal, isVisible: true },
    { icon: 'check', text: 'Resolve', onClick: openResolveModal, isVisible: canResolve },
    { icon: 'warning-2', text: 'Blacklist', onClick: undefined, isVisible: true },
    // { icon: 'user-2', text: 'Contact', onClick: () => history.push(`/s/lists/${contactTableID}`), isVisible: true },
    {
      icon: 'user-2',
      text: 'Contact',
      onClick: () => window.open(`/s/lists/${contactTableID}`, '_blank'),
      isVisible: true,
    },
    { icon: 'chat', text: 'Mark Unread', onClick: undefined, isVisible: true },
    {
      icon: 'multi-user',
      text: 'Assign Conversation',
      onClick: openAssignModal,
      isVisible: canAssign,
    },
  ];

  return (
    <Popover initialFocusRef={initialFocusRef} {...props}>
      <PopoverTrigger>{props.children}</PopoverTrigger>

      <PopoverContent
        zIndex={1500}
        padding="1.5rem"
        minWidth={['320px', '380px', '380px', '380px']}
      >
        <PopoverCloseButton right=".25rem" />

        <Text
          fontWeight={500}
          lineHeight="1rem"
          fontSize=".75rem"
          letterSpacing=".05em"
          textTransform="uppercase"
          color="rgba(0, 0, 0, 0.5)"
        >
          {`Conversation with ${sender_name}`}
        </Text>

        <Grid
          marginTop="2rem"
          templateColumns="repeat(2, 1fr)"
          gap="1.875rem 4.5rem"
          justifyContent="start"
        >
          {actions
            .filter(({ isVisible }) => isVisible)
            .map(({ text, icon, onClick }, index) => (
              <MenuItem
                icon={icon}
                key={`${text}-${icon}`}
                text={text}
                initialFocusRef={index === 0 ? initialFocusRef : null}
                onClick={onClick}
              />
            ))}
        </Grid>
      </PopoverContent>
    </Popover>
  );
}

function Right({
  sender_id,
  currentThreadID,
  ...props
}: StackProps & {
  currentThreadID: string;
  sender_id: string;
}) {
  const [isAssignModalOpened, setIsAssignModalOpened] = useState(false);
  const [isResolveModalOpened, setIsResolveModalOpened] = useState(false);
  const [isNoteModalOpened, setIsNoteModalOpened] = useState(false);
  const [isAssignUsersHover, setIsAssignUsersHover] = useState(false);

  const { state: threadState } =
    useSelector((state: RootState) => selectThreadDetailByID(state, currentThreadID)) ||
    INBOX_INIT.thread;
  const assignments =
    useSelector((state: RootState) =>
      selectAssignmentsByThreadID(state, { thread_id: currentThreadID }),
    ) || [];
  const profile = useSelector(selectProfile);
  const lastAssignment = assignments[assignments.length - 1];

  const canAssign = assignments.length < 2 && threadState !== 'resolved';
  const canResolve = threadState === 'assigned' && lastAssignment?.assignee_id === profile?.user_id;

  return (
    <>
      <Stack {...props} spacing="1.25rem" isInline alignItems="center">
        {assignments.length > 1 && (
          <Box
            position="relative"
            cursor="pointer"
            marginLeft=".625rem"
            minWidth="2.8125rem"
            onMouseEnter={() => setIsAssignUsersHover(true)}
            onMouseLeave={() => setIsAssignUsersHover(false)}
          >
            {assignments.map((item, index) => {
              let currentItem = { first_name: '', last_name: '', id: '' };

              if (item && item.assignee) {
                currentItem = item.assignee as any;
              }

              const { first_name, last_name, id: avatarID } = currentItem;
              return (
                <Avatar
                  key={`${index}-${avatarID}`}
                  height="1.875rem"
                  width="1.875rem"
                  fontSize="calc(1.875rem / 2.5)"
                  name={`${first_name} ${last_name}`}
                  marginRight={isAssignUsersHover ? '.125rem' : '0'}
                  left={index === 0 ? '0' : isAssignUsersHover ? '0' : '.9375rem'}
                  position={index === 0 ? 'unset' : isAssignUsersHover ? 'relative' : 'absolute'}
                />
              );
            })}
          </Box>
        )}

        {canAssign && (
          <Button
            height="auto"
            display="flex"
            variant="ghost"
            padding=".5rem"
            minWidth="auto"
            variantColor="blue"
            alignItems="center"
            marginRight="1.25rem"
            onClick={() => setIsAssignModalOpened(true)}
          >
            <Avatar
              height="1.5rem"
              width="1.5rem"
              fontSize="calc(1.5rem / 2.5)"
              marginRight=".25rem"
              name={`${profile?.first_name} ${profile?.last_name}`}
            />

            <Text fontSize=".8675rem" color="#000" fontWeight="normal">
              Assign to someone
            </Text>

            <Icon
              name={isAssignModalOpened ? 'chevron-down' : 'chevron-right'}
              fontSize="1rem"
              color="#333"
              marginLeft=".625rem"
            />
          </Button>
        )}

        <Box backgroundColor="rgba(0, 0, 0, 0.06)" width="1px" height="1.5rem" />

        {canResolve && (
          <IconButton
            // @ts-ignore
            icon="fat-check"
            size="sm"
            padding=".5rem"
            variant="ghost"
            variantColor="blue"
            height="auto"
            minWidth="auto"
            marginRight="1.25rem"
            onClick={() => setIsResolveModalOpened(true)}
          />
        )}

        <More
          sender_id={sender_id}
          canAssign={canAssign}
          canResolve={canResolve}
          openAssignModal={() => setIsAssignModalOpened(true)}
          openResolveModal={() => setIsResolveModalOpened(true)}
          openNoteModal={() => setIsNoteModalOpened(true)}
        >
          <IconButton
            // @ts-ignore
            icon="overflow"
            size="sm"
            padding=".5rem"
            variant="ghost"
            variantColor="blue"
            height="auto"
            minWidth="auto"
          />
        </More>
      </Stack>

      <Assign
        currentThreadID={currentThreadID}
        isModalOpened={isAssignModalOpened}
        setIsModalOpened={setIsAssignModalOpened}
      />
      <Note isModalOpened={isNoteModalOpened} setIsModalOpened={setIsNoteModalOpened} />
      {profile?.user_id && (
        <Resolve
          user_id={profile.user_id}
          thread_id={currentThreadID}
          isModalOpened={isResolveModalOpened}
          setIsModalOpened={setIsResolveModalOpened}
        />
      )}
    </>
  );
}

export function Header({ currentThreadID, receiver_id, sender_id, ...props }: MessageHeaderProps) {
  return (
    <Flex {...props}>
      <Left
        sender_id={sender_id}
        receiver_id={receiver_id}
        fontWeight={500}
        textAlign="left"
        letterSpacing="0.05rem"
        mr="auto"
      />

      <Right sender_id={sender_id} currentThreadID={currentThreadID} />
    </Flex>
  );
}
