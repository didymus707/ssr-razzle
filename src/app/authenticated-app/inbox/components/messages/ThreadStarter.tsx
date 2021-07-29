import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  PseudoBox,
  Stack,
  Text,
} from '@chakra-ui/core';
import { selectUserID } from 'app/unauthenticated-app/authentication';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { validateEmail } from 'utils';
import { RootState } from '../../../../../root';
import { HighlightableText, Menu, SmallText, SocialIcon, XSmallText } from '../../../../components';
import { selectContactList } from '../../../lists/lists.slice';
import { TableContactOptions } from '../../../tables';
import { INBOX_INIT } from '../../inbox.data';
import { QuickReplySchema, ThreadSchema, ThreadStarterProps } from '../../inbox.types';
import { transformSenderToContact } from '../../inbox.utils';
import {
  searchContactList,
  selectColumnById,
  selectContactTable,
  selectThreadById,
} from '../../slices';
import { Template as TemplateModal } from './compose/Template';
import { ConversationThreadFooter } from './ConversationThreadFooter';

export function ThreadStarter({
  text,
  setText,
  channels,
  showCompose,
  twoWayPayload,
  setShowCompose,
  setActiveThread,
  setActiveFilter,
  setTwoWayPayload,
  ...rest
}: ThreadStarterProps) {
  const history = useHistory();
  const user_id = useSelector(selectUserID);
  const [receiver, setReceiver] = useState({});
  const [credential_id, setCredentialId] = useState('');
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [sender, setSender] = useState<ThreadSchema['sender']>();

  const handleAcctSelected = (value: any) => {
    const { credential_id } = value;
    setSender(value);
    setCredentialId(credential_id);
    twoWayPayload && setTwoWayPayload({ ...twoWayPayload });
  };

  const handleContactSelect = (payload: {
    senderPlatformNick: string;
    contact_id?: string;
    contactName?: string;
  }) => {
    setReceiver({
      platform_nick: payload.senderPlatformNick,
      platform_name: payload.contactName,
    });
  };

  useEffect(() => {
    return history.listen(() => {
      setTwoWayPayload({
        ...twoWayPayload,
        contactName: '',
        contact_id: undefined,
        senderPlatformNick: '',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const thread = useMemo(() => {
    return {
      sender,
      receiver_id: user_id,
      receiver: { uuid: user_id, ...receiver },
    };
  }, [sender, user_id, receiver]);

  return (
    <Flex bg="white" overflowY="hidden" flexDirection="column" {...rest}>
      <Flex h="calc(100vh - 60px)" p="1rem" overflowY="hidden" flexDirection="column">
        <Header channels={channels} setSelectedAcct={handleAcctSelected} />

        <Middle
          flex={1}
          thread={thread}
          setText={setText}
          marginTop="2.8125rem"
          showCompose={showCompose}
          setReceiver={setReceiver}
          twoWayPayload={twoWayPayload}
          setShowCompose={setShowCompose}
          setIsTemplateMode={setIsTemplateMode}
          setContactSelected={handleContactSelect}
          setTwoWayPayload={(v: any) => setTwoWayPayload({ ...twoWayPayload, ...v })}
        />
        <ConversationThreadFooter
          text={text}
          //@ts-ignore
          thread={thread}
          isTemplateMode={isTemplateMode}
          setActiveFilter={setActiveFilter}
          setActiveThread={setActiveThread}
          setTwoWayPayload={setTwoWayPayload}
          twoWayPayload={{ ...twoWayPayload, credential_id }}
        />
      </Flex>
    </Flex>
  );
}

function Account({
  index,
  channel,
  selectedAcct,
  onAccountChange,
}: {
  channel: any;
  index: number;
  selectedAcct: any;
  onAccountChange: (v: any) => void;
}) {
  const { uuid: credential_id, user } = channel;
  const { channel_name, platform_name, platform_nick } = user;

  useEffect(() => {
    if (!selectedAcct && index === 0) {
      onAccountChange({ credential_id, channel_name, platform_name, platform_nick });
    }
  }, [
    channel_name,
    index,
    onAccountChange,
    platform_name,
    selectedAcct,
    credential_id,
    platform_nick,
  ]);

  return (
    <PseudoBox
      p="0.5rem"
      as="button"
      tabIndex={0}
      width="100%"
      display="flex"
      cursor="pointer"
      alignItems="center"
      _hover={{ bg: '#F2F2F2', cursor: 'pointer', outline: 0, border: '3px' }}
      _focus={{ bg: '#F2F2F2', outline: 0, cursor: 'pointer', border: '3px' }}
      _active={{ bg: '#F2F2F2', outline: 0, cursor: 'pointer', border: '3px' }}
      onClick={() => onAccountChange({ credential_id, channel_name, platform_name, platform_nick })}
      bg={selectedAcct?.credential_id === credential_id ? 'rgba(61, 80, 223, 0.05)' : 'initial'}
    >
      <Stack isInline alignItems="center">
        <Box>
          <SocialIcon which={channel_name} size="1rem" />
        </Box>
        <XSmallText color="gray.900" fontWeight="medium" textTransform="uppercase">
          {`${platform_name ?? ''}${platform_name && platform_name !== platform_nick ? ':' : ''}`}
        </XSmallText>
        {platform_name !== platform_nick && (
          <XSmallText color="gray.400">{platform_nick || ''}</XSmallText>
        )}
      </Stack>
    </PseudoBox>
  );
}

function AccountPicker({ setSelected, channels, ...rest }: any) {
  const [selectedAcct, setSelectedAcct] = useState<any>(null);

  const [firstAccount] = channels ?? [];

  const { channel_name, platform_name, platform_nick } = firstAccount?.user ?? {};

  const handleSelectAcct = (value: any) => {
    setSelectedAcct(value);
    setSelected(value);
  };

  useEffect(() => {
    const onSelectAcct = (value: any) => {
      setSelectedAcct(value);
      setSelected(value);
    };

    if (!selectedAcct && firstAccount) {
      onSelectAcct({
        ...firstAccount,
        channel_name,
        platform_nick,
        platform_name,
        credential_id: firstAccount.uuid,
      });
    }
  }, [channel_name, firstAccount, platform_name, platform_nick, selectedAcct, setSelected]);

  const renderItem = (channel: any, index?: number) => {
    return (
      <Box key={channel.uuid}>
        <Account
          channel={channel}
          index={index ?? 0}
          selectedAcct={selectedAcct}
          onAccountChange={handleSelectAcct}
        />
      </Box>
    );
  };

  return (
    <Menu
      menuListProps={{
        width: 'auto',
      }}
      renderItem={renderItem}
      //TODO: Remove filter when endpoint for sending new message is available on other channels
      options={channels}
      menuButtonProps={{
        px: '0',
        minW: 'unset',
        children: (
          <Stack isInline alignItems="center">
            {selectedAcct?.channel_name && (
              <Box position="relative" top="-3px">
                <SocialIcon which={selectedAcct?.channel_name} size="1rem" />
              </Box>
            )}
            <SmallText fontWeight="bold">
              {selectedAcct?.platform_name ?? selectedAcct?.platform_nick ?? 'Click to select'}
            </SmallText>
            <Icon size="1rem" color="#333333" marginLeft=".75rem" name="chevron-down" />
          </Stack>
        ),
      }}
    />
  );
}

function Header({ setSelectedAcct, channels }: any) {
  return (
    <Stack isInline alignItems="center">
      <Text fontWeight={600} fontSize=".9375rem" lineHeight="22px">
        New Message from:
      </Text>

      <AccountPicker channels={channels} marginLeft="1.125rem" setSelected={setSelectedAcct} />
    </Stack>
  );
}

function ContactSearchResult({ setSelectedContact, searchQuery, matchedContacts }: any) {
  if (matchedContacts.length === 0) {
    return <Box />;
  }

  const searchText = searchQuery?.replaceAll('+', '') || '';

  return (
    <>
      <Text
        color="#828282"
        fontWeight={500}
        lineHeight="16px"
        fontSize=".6875rem"
        textTransform="uppercase"
      >
        matched contacts:
      </Text>

      <Stack flex={1} spacing="1rem" overflowY="auto" marginTop="1.25rem">
        {matchedContacts.map(({ key, name, nick }: any, index: number) => (
          <PseudoBox
            key={key}
            as="button"
            tabIndex={0}
            rounded="8px"
            display="flex"
            padding=".25rem"
            cursor="pointer"
            alignItems="center"
            onClick={() => setSelectedContact(matchedContacts[index])}
            _hover={{ bg: '#F2F2F2', cursor: 'pointer', outline: 0, border: '3px' }}
            _focus={{ bg: '#F2F2F2', outline: 0, cursor: 'pointer', border: '3px' }}
            _active={{ bg: '#F2F2F2', outline: 0, cursor: 'pointer', border: '3px' }}
          >
            {name && <HighlightableText text={name} highlight={searchText} />}
            {nick && (
              <HighlightableText
                text={nick}
                color={name ? '#828282' : 'inherit'}
                highlight={searchText}
                marginLeft={name ? '.5rem' : '0'}
              />
            )}
          </PseudoBox>
        ))}
      </Stack>
    </>
  );
}

function Template({
  setText,
  twoWayPayload,
  setIsTemplateMode,
}: Pick<ThreadStarterProps, 'setText' | 'twoWayPayload'> & {
  setIsTemplateMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params = useParams<{ id: string }>();
  const currentThreadID = params.id;

  let [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const data: { quick_replies: QuickReplySchema[] } | undefined = queryClient.getQueryData([
    'quick-replies',
    1,
  ]);

  const thread =
    useSelector((state: RootState) =>
      selectThreadById(state, currentThreadID === 'start' ? '' : currentThreadID),
    ) || INBOX_INIT.thread;
  const contactTable = useSelector(selectContactTable);

  const contact = useSelector((state: RootState) =>
    selectColumnById(state, twoWayPayload?.contact_id || ''),
  );

  let suggestedTemplates = data?.quick_replies.slice(0, 3);

  if (suggestedTemplates && suggestedTemplates?.length > 0) {
    suggestedTemplates?.push({
      id: Date.now(),
      uuid: 'seealltemplates',
      name: 'See All Templates...',
      template: { content: 'seealltemplates', subject: '' },
    });
  }

  const handleClick = (template: string) => {
    if (template !== 'seealltemplates') {
      let con = contact;
      if (!con && contactTable && twoWayPayload) {
        const { contactName: platform_name, senderPlatformNick: platform_nick } = twoWayPayload;
        const [, c] = transformSenderToContact(contactTable, {
          ...INBOX_INIT.customer,
          platform_nick,
          channel: 'sms',
          platform_name: platform_name || platform_nick,
        });
        con = c;
      }

      setIsTemplateMode?.(true);

      return setText(template);
      // return setText(parseTemplate(template || '', contactTable, con), true);
    }

    setIsOpen(true);
  };

  return suggestedTemplates?.length === 0 ? (
    <Box />
  ) : (
    <Box marginBottom="0.5rem">
      <Text
        color="#828282"
        fontWeight={500}
        lineHeight="16px"
        fontSize=".6875rem"
        textTransform="uppercase"
        letterSpacing="0.05rem"
      >
        Suggested templates:
      </Text>

      <Stack marginTop=".75rem" spacing="1rem" isInline>
        {suggestedTemplates?.map(({ name, id, template }) => (
          <Button
            key={id}
            height="auto"
            minWidth="auto"
            paddingX=".5rem"
            variant="outline"
            paddingY="0.25rem"
            variantColor="blue"
            _focus={{ boxShadow: 'none' }}
            _active={{ boxShadow: 'none' }}
            onClick={() => handleClick(template.content)}
          >
            <Text marginLeft="0" fontSize=".75rem" lineHeight="14px" fontWeight="normal">
              {name}
            </Text>
          </Button>
        ))}
      </Stack>

      <TemplateModal
        setText={setText}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        sender_id={thread.sender_id}
        contact_id={twoWayPayload?.contact_id}
      />
    </Box>
  );
}

function Middle({
  thread,
  setText,
  showCompose,
  setReceiver,
  twoWayPayload,
  setShowCompose,
  setTwoWayPayload,
  setIsTemplateMode,
  setContactSelected,
  ...rest
}: any) {
  const dispatch = useDispatch();
  const contactList = useSelector(selectContactList);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sendToError, setSendToError] = useState('');
  const [filterContacts, setFilterContacts] = useState<TableContactOptions[]>([]);

  const isValidSendTo =
    validateEmail(twoWayPayload.senderPlatformNick) ||
    parsePhoneNumberFromString(twoWayPayload.senderPlatformNick || '')?.isValid();
  const channel_name = thread?.sender?.channel_name;

  const getPlaceholder = () => {
    if (channel_name && channel_name === 'email') {
      return 'Enter name or email';
    }
    if (channel_name && (channel_name === 'phone' || channel_name.includes('whatsapp'))) {
      return 'Enter name or phone number';
    }
    return 'Enter name';
  };

  const handleContactSelect = (value: any) => {
    const { name, nick, key } = value;
    const twoWayPayload = {
      senderPlatformNick: nick,
      contactName: name,
      contact_id: key,
    };
    setTwoWayPayload(twoWayPayload);
    setContactSelected(twoWayPayload);
    setFilterContacts([]);
  };

  const handleContactSearch = async (value: string) => {
    let newTwoWayPayload: any = { senderPlatformNick: value };
    const c = parsePhoneNumberFromString(value || '')?.isValid();

    if (isValidSendTo && twoWayPayload.contact_id && !c) {
      newTwoWayPayload = { ...newTwoWayPayload, contactName: '', contact_id: undefined };
    } else if (c && filterContacts.length > 0) {
      const [{ phone, email, id: key, name }] = filterContacts;
      if (phone === value || email === value) {
        newTwoWayPayload = { ...newTwoWayPayload, contactName: name, contact_id: key };
      }
    }

    setReceiver({
      platform_name: '',
      platform_nick: value ?? '',
    });
    setTwoWayPayload(newTwoWayPayload);

    if (!value) {
      return setFilterContacts([]);
    }

    const fc: any = await dispatch(
      searchContactList({
        page: 1,
        limit: 20,
        sorts: [],
        filters: [],
        query: value,
        table_id: contactList.id,
      }),
    );
    if (searchContactList.fulfilled.match(fc)) {
      const f: { [key: string]: string } = {};
      for (let item of contactList.columns) {
        f[item.id] = item.name;
      }

      const getKeyFunc = (key: string) => {
        if (key.includes('phone')) {
          return 'phone';
        }
        if (key.includes('email')) {
          return 'email';
        }
        return key;
      };

      const newPayload = fc.payload.map((item: any) => {
        const columnsWithValues: { [key: string]: any } = {};
        Object.keys(f).forEach(key => {
          columnsWithValues[getKeyFunc(f[key])] = item.columns[key];
        });
        return { ...item, ...columnsWithValues };
      });
      setFilterContacts(newPayload);
    } else {
      console.log(fc.error.message);
    }
  };

  const formItems = [
    {
      isRequired: true,
      title: 'send to',
      isReadOnly: false,
      name: 'senderPlatformNick',
      placeholder: getPlaceholder(),
      onChange: (e: any) => handleContactSearch(e.target.value),
    },
  ];

  if (isValidSendTo) {
    formItems.push({
      title: 'name',
      isRequired: false,
      placeholder: 'Name',
      name: 'contactName',
      isReadOnly: !!twoWayPayload.contact_id,
      onChange: (e: any) => setTwoWayPayload({ contactName: e.target.value }),
    });
  }

  return (
    <Stack {...rest} spacing="1.5625rem" overflowY="hidden">
      {formItems.map(({ title, placeholder, name, isRequired, onChange, isReadOnly }) => (
        <FormControl
          key={name}
          isRequired={isRequired}
          isInvalid={name === 'sendTo' ? !!sendToError : undefined}
        >
          <FormLabel
            htmlFor={title}
            color="#828282"
            fontWeight={500}
            lineHeight="16px"
            fontSize=".6875rem"
            textTransform="uppercase"
          >
            {title}:
          </FormLabel>

          <Input
            type="text"
            border="none"
            paddingLeft="0"
            borderRadius="0"
            fontWeight={500}
            lineHeight="34px"
            marginTop="1.25rem"
            onChange={onChange}
            fontSize="1.6875rem"
            paddingBottom="1rem"
            paddingRight="0.75rem"
            isReadOnly={isReadOnly}
            placeholder={placeholder}
            value={twoWayPayload[name]}
            className="input-no-error-border"
            _focus={{
              boxShadow: 'none',
              borderColor: 'transparent',
              borderBottom: '1px solid #E0E0E0',
            }}
          />
          {name === 'sendTo' && sendToError && <FormErrorMessage>{sendToError}</FormErrorMessage>}
        </FormControl>
      ))}

      <Flex
        flex={1}
        overflowY="hidden"
        flexDirection="column"
        justifyContent={isValidSendTo ? 'flex-end' : 'flex-start'}
      >
        {isValidSendTo ? (
          <Template
            setText={setText}
            twoWayPayload={twoWayPayload}
            setIsTemplateMode={setIsTemplateMode}
          />
        ) : (
          <ContactSearchResult
            searchQuery={twoWayPayload?.senderPlatformNick}
            setSelectedContact={handleContactSelect}
            matchedContacts={(filterContacts || [])
              //TODO: Remove filter when endpoint for filtering contacts is available
              .filter(
                ({ phone, email }) =>
                  (channel_name === 'phone' && phone) || (channel_name === 'email' && email),
              )
              .map(({ id: key, name, phone, email }) => ({
                key,
                name,
                nick: channel_name === 'phone' ? phone : email,
              }))}
          />
        )}
      </Flex>
    </Stack>
  );
}
