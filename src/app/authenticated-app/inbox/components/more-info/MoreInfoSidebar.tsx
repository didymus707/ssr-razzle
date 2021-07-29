import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  Stack,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import styled from '@emotion/styled';
import { getFilterFieldRenderer, querySegment } from 'app/authenticated-app/lists';
import { selectContactList, selectLists } from 'app/authenticated-app/lists/lists.slice';
import { createRow, filterRows, getRow, updateRow } from 'app/authenticated-app/tables';
import {
  BodyText,
  Button,
  FormLabel,
  Menu,
  MenuItem,
  SmallText,
  Subtitle,
  ToastBox,
  XSmallText,
} from 'app/components';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { AnimateSharedLayout, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import { OptionTypeBase } from 'react-select';
import { isServer } from 'utils';
import { channelOptions } from '../..';
import {
  addProfileToContact,
  getConversationNotes,
  getInboxConnections,
  getThreadByID,
} from '../../inbox.service';
import { InboxConnection, NoteSchema, ThreadSchema } from '../../inbox.types';
import { MoreInfoSidebarCard } from './MoreInfoSidebarCard';

export type MoreInfoSidebarProps = { thread?: ThreadSchema };

export const MoreInfoSidebar = (props: MoreInfoSidebarProps) => {
  const { thread: threadProp } = props;
  const handle = () => {
    return <div className="handle" />;
  };

  const toast = useToast();
  const {
    isOpen: isEditSectionOpen,
    onOpen: onOpenEditSection,
    onClose: onCloseEditSection,
  } = useDisclosure();

  const { isOpen: isDataModelCardOpen, onToggle: onToggleDataModelCard } = useDisclosure();
  const { isOpen: isContactListCardOpen, onToggle: onToggleContactListCard } = useDisclosure();

  const queryClient = useQueryClient();
  const lists: any = useSelector(selectLists);
  const contactList = useSelector(selectContactList);

  const { data: thread } = useQuery<ThreadSchema, AxiosError>(
    ['threads', threadProp?.uuid],
    () => getThreadByID({ thread_id: threadProp?.uuid }),
    {
      initialData: threadProp,
      enabled: !!threadProp?.uuid,
    },
  );

  const { sender, sender_id } = thread ?? {};

  const [width, setWidth] = useState(80);
  const [section, setSection] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [staticWidth, setStaticWidth] = useState(80);
  const [background, setBackground] = useState('white');
  const [contactId, setContactId] = useState(sender?.contact_id);
  const [columnsWithValue, setColumnsWithValue] = useState<any[]>([]);
  const [columnsWithoutValue, setColumnsWithoutValue] = useState<any[]>([]);

  const fetchConversationNotes = async ({ pageParam = 1, queryKey }: any) => {
    const customer_id = queryKey[1];
    return getConversationNotes({ page: pageParam, customer_id });
  };

  const { mutate: updateContactData } = useMutation<any, AxiosError, any, any>(
    (payload: { id: string; columns: OptionTypeBase }) => updateRow(payload),
    {
      onMutate: async payload => {
        await queryClient.cancelQueries(['row-data', contactId]);

        const previousRowData: any = queryClient.getQueryData(['row-data', contactId]);
        const newRowData = { ...previousRowData, columns: payload.columns };

        queryClient.setQueryData(['row-data', contactId], newRowData);

        return { previousRowData, newRowData };
      },
      onError: (err, newRowData, context) => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
        queryClient.setQueryData(['row-data', contactId], context.previousRowData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['row-data', contactId]);
        queryClient.invalidateQueries('threads');
        queryClient.invalidateQueries(['list-query', thread?.uuid]);
      },
    },
  );

  const { mutate: onAddProfileToContact, isLoading: isAddingProfileToContact } = useMutation<
    any,
    AxiosError,
    any,
    any
  >(contactID => addProfileToContact({ contactID, customer_id: sender_id ?? '' }), {
    onError: error => {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={error.message} />,
      });
    },
    onSuccess: data => {
      setContactId(data.profile.contact_id);
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message="Profile added to contact list" status="success" />,
      });
    },
  });

  const { mutate: onAddToContactList, isLoading: isAddingToContactList } = useMutation<
    any,
    AxiosError,
    any,
    any
  >(({ columns, table_id }) => createRow({ columns, table_id }), {
    onError: error => {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={error.message} />,
      });
    },
    onSuccess: data => {
      const contactID = data?.data?.row?.id;
      onAddProfileToContact(contactID);
    },
  });

  const { data: rowData } = useQuery(['row-data', contactId], () => getRow(contactId ?? ''), {
    enabled: !!contactId,
  });

  const { data } = useInfiniteQuery<any, AxiosError>(['notes', sender_id], fetchConversationNotes, {
    getNextPageParam: lastPage => {
      return lastPage.data.meta.page < lastPage.data.meta.page_count
        ? lastPage.data.meta.page + 1
        : undefined;
    },
    enabled: !!sender_id,
  });

  const { data: connections } = useQuery<InboxConnection[], any>(
    'inbox-connections',
    getInboxConnections,
    {
      enabled: !!thread?.uuid,
    },
  );

  const listConnection = useMemo(() => {
    return connections?.find(item => item.table_id);
  }, [connections]);

  const listConnectionInfo = useMemo(() => {
    if (listConnection && listConnection.table_id) {
      return lists[listConnection?.table_id];
    }
    return '';
  }, [listConnection, lists]);

  const listFilters = useMemo(() => {
    return listConnection?.variables.filters.find(
      filter => filter.channel === thread?.sender?.channel_name,
    );
  }, [listConnection, thread]);

  const dataModelConnection = useMemo(() => {
    return connections?.find(item => item.data_model_id);
  }, [connections]);

  const dataModelFilters = useMemo(() => {
    return dataModelConnection?.variables.filters.find(
      filter => filter.channel === thread?.sender?.channel_name,
    );
  }, [dataModelConnection, thread]);

  const { data: dataModelQuery } = useQuery(
    ['data-model-query', thread?.uuid],
    () => {
      const { columnID: column, operator } = dataModelFilters ?? {};
      return querySegment({
        data_model: dataModelConnection?.data_model_id,
        filters: [
          {
            column,
            operator,
            value: thread?.sender?.platform_nick,
          },
        ],
      });
    },
    {
      enabled: !!contactId && !!dataModelConnection && !!dataModelFilters,
    },
  );

  const { data: listQuery } = useQuery(
    ['list-query', thread?.uuid],
    () => {
      const { columnID, operator, columnType, name } = listFilters ?? {};
      return filterRows({
        page: 1,
        limit: 200,
        table_id: listConnection?.table_id,
        filters: [
          {
            name,
            columnID,
            operator,
            columnType,
            subOperator: null,
            value: thread?.sender?.platform_nick,
          },
        ],
      });
    },
    {
      enabled: !!contactId && !!listConnection && !!listFilters,
    },
  );

  const notes = data?.pages?.reduce((acc, page) => [...acc, ...page.data.notes], []) ?? [];

  const getContactRowData = () => {
    const nameColumn = contactList.columns.find((item: any) => item.name.toLowerCase() === 'name');
    const phoneNumberColumn = contactList.columns.find(
      (item: any) => item.type.toLowerCase() === 'phone number',
    );
    const emailColumn = contactList.columns.find(
      (item: any) => item.type.toLowerCase() === 'email',
    );

    let columns = {
      [nameColumn.id]: sender?.name,
    };

    if (sender?.channel_name === 'email' && emailColumn) {
      columns[emailColumn.id] = sender?.platform_nick;
    }
    if (
      phoneNumberColumn &&
      (sender?.channel_name === 'phone' ||
        sender?.channel_name === 'whatsapp' ||
        sender?.channel_name === 'whatsappWeb')
    ) {
      columns[phoneNumberColumn.id] = sender?.platform_nick;
    }

    return columns;
  };

  const handleAddContact = async () => {
    const columns = getContactRowData();
    onAddToContactList({
      columns,
      table_id: contactList.id,
    });
  };

  const handleResize = (e: any, d: any) => {
    if (d.size.width === 302) {
      setIsOpen(true);
    }
    if (d.size.width === 80) {
      setIsOpen(false);
    }
    setWidth(d.size.width);
  };

  useEffect(() => {
    setContactId(sender?.contact_id);
  }, [sender]);

  useEffect(() => {
    if (isOpen) {
      setWidth(302);
      setStaticWidth(302);
    } else {
      setWidth(80);
      setStaticWidth(80);
    }
  }, [isOpen]);

  useEffect(() => {
    if (width <= 200) {
      setSection(0);
      setBackground('white');
    } else {
      setSection(1);
      setBackground('#F4F6F9');
    }
  }, [width]);

  useEffect(() => {
    if (rowData) {
      let columnsWithValue = contactList.columns.filter((column: any) =>
        Object.keys(rowData?.columns).includes(column.id.toString()),
      );
      let columnsWithoutValue = contactList.columns.filter(
        (column: any) => !Object.keys(rowData?.columns).includes(column.id.toString()),
      );

      setColumnsWithValue(columnsWithValue);
      setColumnsWithoutValue(columnsWithoutValue);
    }
  }, [contactList.columns, rowData, contactId]);

  return (
    <MoreInfoSidebarContainer background={background}>
      <ResizableBox
        axis="x"
        className="box"
        handle={handle()}
        width={staticWidth}
        resizeHandles={['w']}
        onResize={handleResize}
        minConstraints={[80, 100]}
        height={isServer ? 900 : window.innerHeight}
        maxConstraints={[302, isServer ? 900 : window.innerHeight]}
      >
        {section === 0 ? (
          <Flex my="4.75rem" flexDirection="column" justifyContent="center" alignItems="center">
            <Avatar
              size="sm"
              color="white"
              cursor="pointer"
              name={sender?.name}
              onClick={() => setIsOpen(true)}
              src={sender?.image_url ?? undefined}
            />
          </Flex>
        ) : (
          <Box mt="2.5rem" mb="10rem">
            {isOpen && (
              <Button
                top="0"
                size="sm"
                right="0.5rem"
                variant="ghost"
                position="absolute"
                onClick={() => setIsOpen(false)}
              >
                <Icon size="1rem" name="inbox-close" color="gray.800" />
              </Button>
            )}
            <AnimateSharedLayout>
              {!isEditSectionOpen && (
                <MotionBox
                  layout
                  exit={{ opacity: 0, x: -302 }}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 302 }}
                  transition={{ ease: 'easeOut' }}
                >
                  <MoreInfoSidebarCard mb="2rem" position="relative">
                    <Tooltip
                      zIndex={10000}
                      placement="bottom"
                      label="Edit Contact"
                      aria-label="edit-contact"
                    >
                      <Button
                        px="0"
                        size="xs"
                        width="unset"
                        top="0.25rem"
                        rounded="50%"
                        height="unset"
                        right="0.5rem"
                        display="flex"
                        bg="transparent"
                        variant="unstyled"
                        position="absolute"
                        alignItems="center"
                        justifyContent="center"
                        onClick={onOpenEditSection}
                      >
                        <Icon name="inbox-edit-contact-info" color="blue.400" size="1.5rem" />
                      </Button>
                    </Tooltip>
                    <Flex justifyContent="center" alignItems="center" flexDirection="column">
                      <Avatar
                        size="lg"
                        showBorder
                        mb="1.25rem"
                        color="white"
                        name={sender?.name}
                        src={sender?.image_url ?? undefined}
                      />

                      <Icon
                        pb="0.5rem"
                        size="1.5rem"
                        color="gray.600"
                        name={sender?.channel_name ? channelOptions[sender?.channel_name].icon : ''}
                      />
                      <BodyText
                        pb="0.25rem"
                        color="gray.900"
                        textAlign="center"
                        fontWeight="medium"
                        wordBreak="break-all"
                      >
                        {sender?.name}
                      </BodyText>
                      <SmallText wordBreak="break-all" color="gray.500" textAlign="center">
                        {sender?.platform_nick}
                      </SmallText>
                    </Flex>
                  </MoreInfoSidebarCard>

                  {!!dataModelQuery?.length && (
                    <Box mb="2rem">
                      <Subtitle pb="1rem" color="black">
                        {dataModelConnection?.data_model_name}
                      </Subtitle>
                      {dataModelQuery?.map((model: any, index: number) => (
                        <MoreInfoSidebarCard
                          mb="0.5rem"
                          px="0.5rem"
                          py="0.75rem"
                          overflowX="auto"
                          key={`${index}`}
                        >
                          <Collapse startingHeight={100} isOpen={isDataModelCardOpen}>
                            {Object.keys(model).map((modelItem, index) => (
                              <Stack
                                isInline
                                mb="0.5rem"
                                flexWrap="wrap"
                                key={`${index}`}
                                alignItems="flex-start"
                              >
                                <SmallText
                                  color="gray.900"
                                  fontWeight="bold"
                                  lineHeight="20px"
                                  textTransform="capitalize"
                                >
                                  {modelItem}:
                                </SmallText>
                                <SmallText flex={1} wordBreak="break-all" color="gray.600">
                                  {model[modelItem]}
                                </SmallText>
                              </Stack>
                            ))}
                          </Collapse>

                          <Button
                            size="sm"
                            variant="link"
                            variantColor="blue"
                            onClick={onToggleDataModelCard}
                          >
                            Show {isDataModelCardOpen ? 'less' : 'more'}
                          </Button>
                        </MoreInfoSidebarCard>
                      ))}
                    </Box>
                  )}
                  {!!listQuery?.length && (
                    <Box mb="2rem">
                      <Subtitle pb="1rem" color="black">
                        {listConnection?.table_name}
                      </Subtitle>
                      {listQuery?.map((row: any, index: number) => (
                        <MoreInfoSidebarCard
                          mb="0.5rem"
                          px="0.5rem"
                          py="0.75rem"
                          overflowX="auto"
                          key={`${index}`}
                        >
                          <Collapse startingHeight={100} isOpen={isContactListCardOpen}>
                            {Object.keys(row.columns).map((column, index) => {
                              if (column === '_system') {
                                return null;
                              }
                              const listColumnNames: { [key: string]: string } = {};

                              for (let item of listConnectionInfo.columns) {
                                listColumnNames[item.id] = item.name;
                              }

                              return (
                                <Stack
                                  isInline
                                  mb="0.5rem"
                                  key={`${index}`}
                                  alignItems="flex-start"
                                >
                                  <SmallText
                                    width="60px"
                                    lineHeight="20px"
                                    color="gray.900"
                                    fontWeight="bold"
                                    textTransform="capitalize"
                                  >
                                    {listColumnNames[column]}:
                                  </SmallText>
                                  <SmallText flex={1} color="gray.600" wordBreak="break-all">
                                    {row.columns[column]}
                                  </SmallText>
                                </Stack>
                              );
                            })}
                          </Collapse>

                          <Button
                            size="sm"
                            variant="link"
                            variantColor="blue"
                            onClick={onToggleContactListCard}
                          >
                            Show {isContactListCardOpen ? 'less' : 'more'}
                          </Button>
                        </MoreInfoSidebarCard>
                      ))}
                    </Box>
                  )}
                  {!!notes?.length && (
                    <Box mb="2rem">
                      <Subtitle pb="1rem" color="black">
                        Cases
                      </Subtitle>
                      {notes?.map((note: NoteSchema) => (
                        <MoreInfoSidebarCard key={note.uuid} mb="0.5rem" py="0.75rem" px="0.5rem">
                          <Stack mb="0.5rem" isInline alignItems="center">
                            <Avatar
                              size="sm"
                              color="white"
                              name={sender?.name}
                              src={sender?.image_url ?? undefined}
                            />
                            <Box>
                              <SmallText color="gray.900">{sender?.name}</SmallText>
                              <XSmallText color="gray.400">
                                {format(new Date(note.created_datetime), 'do MMM yyyy')}
                              </XSmallText>
                            </Box>
                          </Stack>
                          <SmallText>{note.content}</SmallText>
                        </MoreInfoSidebarCard>
                      ))}
                    </Box>
                  )}
                </MotionBox>
              )}
              {isEditSectionOpen && (
                <MotionBox
                  layout
                  exit={{ opacity: 0, x: -302 }}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 302 }}
                  transition={{ ease: 'easeIn' }}
                >
                  <MoreInfoSidebarCard px="0.5rem" position="relative">
                    <Button
                      top="8px"
                      size="xs"
                      left="8px"
                      variant="ghost"
                      position="absolute"
                      variantColor="blue"
                      onClick={onCloseEditSection}
                    >
                      <Stack isInline alignItems="center">
                        <Icon name="inbox-chevron-left" size="1rem" />
                        <SmallText>Back</SmallText>
                      </Stack>
                    </Button>
                    <Flex justifyContent="center" alignItems="center" flexDirection="column">
                      <Avatar
                        size="lg"
                        showBorder
                        mb="1.25rem"
                        color="white"
                        name={sender?.name}
                        src={sender?.image_url ?? undefined}
                      />
                      <BodyText
                        pb="0.25rem"
                        color="gray.900"
                        textAlign="center"
                        fontWeight="medium"
                        wordBreak="break-all"
                      >
                        {sender?.name}
                      </BodyText>
                      <SmallText color="gray.500" textAlign="center" wordBreak="break-all">
                        {sender?.platform_nick}
                      </SmallText>
                    </Flex>
                    {!!contactId && (
                      <>
                        <form>
                          <Stack pt="2.5rem" pb="1rem" spacing="1.5rem">
                            {columnsWithValue.map((column: any) => {
                              let FieldComponent = getFilterFieldRenderer(column.type);
                              return (
                                <Box key={column.id} position="relative">
                                  <FormLabel
                                    p="0 8px"
                                    top="-8px"
                                    left="16px"
                                    zIndex={2}
                                    opacity={1}
                                    rounded="8px"
                                    position="absolute"
                                    backgroundColor="white"
                                  >
                                    {column.label}
                                  </FormLabel>
                                  <FieldComponent
                                    column={column}
                                    inputProps={{
                                      height: '2.5rem',
                                    }}
                                    value={rowData?.columns[column.id]}
                                    updateCellValue={(value: string) =>
                                      updateContactData({
                                        id: rowData.id,
                                        table_id: contactList.id,
                                        columns: { ...rowData.columns, [column.id]: value },
                                      })
                                    }
                                  />
                                </Box>
                              );
                            })}
                          </Stack>
                        </form>
                        {!!columnsWithoutValue.length && (
                          <>
                            <Menu
                              menuListProps={{
                                zIndex: 1000,
                                placement: 'bottom-start',
                              }}
                              options={columnsWithoutValue}
                              renderItem={column => (
                                <MenuItem
                                  key={column.id}
                                  onClick={() => {
                                    setColumnsWithValue([...columnsWithValue, column]);
                                    setColumnsWithoutValue(
                                      columnsWithoutValue.filter(item => item.id !== column.id),
                                    );
                                  }}
                                >
                                  <SmallText>{column.label}</SmallText>
                                </MenuItem>
                              )}
                              menuButtonProps={{
                                rounded: '4px',
                                color: 'blue.500',
                                _hover: { bg: 'blue.100' },
                                children: (
                                  <Stack isInline alignItems="center">
                                    <Icon name="inbox-plus-circle" />
                                    <BodyText>Add a property</BodyText>
                                  </Stack>
                                ),
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                    {!contactId && (
                      <Stack p="0.5rem">
                        <Button
                          size="xs"
                          variant="ghost"
                          variantColor="blue"
                          leftIcon="small-add"
                          onClick={handleAddContact}
                          isLoading={isAddingToContactList || isAddingProfileToContact}
                        >
                          Add contact
                        </Button>
                      </Stack>
                    )}
                  </MoreInfoSidebarCard>
                </MotionBox>
              )}
            </AnimateSharedLayout>
          </Box>
        )}
      </ResizableBox>
    </MoreInfoSidebarContainer>
  );
};

const MoreInfoSidebarContainer = styled.div<{ background: string }>`
  background-color: ${props => props.background};

  .box {
    overflow-y: auto;
    position: relative;
    padding: 0 1rem;
    overflow-x: hidden;
    background-color: ${props => props.background};
    border-left: 1px solid #f4f6f9;
  }

  .handle {
    top: 0;
    left: 0;
    width: 3px;
    position: absolute;
    display: inline-block;
    background-color: transparent;
    height: ${isServer ? '' : window.innerHeight}px;
  }

  .handle:hover {
    cursor: e-resize;
    background-color: #3525e6;
  }
`;

const MotionBox = motion(Box);
