import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  Icon,
  Link,
  PseudoBox,
  Stack,
  Text,
  StackProps,
  IconButton,
} from '@chakra-ui/core';
import { ContactColumnSchema, UserOverviewProps } from '../../inbox.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../root';
import {
  selectAddressBookDetailByID,
  selectContactTable,
  selectCustomerByID,
  selectName,
  selectThreadDetailByID,
} from '../../slices';
import { useParams } from 'react-router-dom';
import { INBOX_INIT } from '../../inbox.data';
import { Contact } from './Contact';
import { Note } from './Note';
import { TablePropertiesOptions } from '../../../tables';
import { sortColumns, transformSenderToContact } from '../../inbox.utils';
import { PropertySchema } from '../../../tables/components';
import { selectThreadReceiverPlatformID } from '../../../channels';

function Icons({ ...props }: StackProps) {
  const params = useParams<{ id: string }>();

  //@ts-ignore
  const { address_book_id, sender_id } =
    useSelector((state: RootState) =>
      selectThreadDetailByID(state, params.id === 'new' ? '' : params.id),
    ) || INBOX_INIT.thread;
  const table = useSelector(selectContactTable);
  const addressBookDetail = useSelector((state: RootState) =>
    selectAddressBookDetailByID(state, address_book_id || ''),
  );
  const senderDetail = useSelector((state: RootState) =>
    selectCustomerByID(state, sender_id || ''),
  );
  let columns: TablePropertiesOptions['columns'] = [];
  let contact: Omit<ContactColumnSchema, 'contact_id'> = {};

  if (!addressBookDetail && table && senderDetail) {
    const [cols, data] = transformSenderToContact(table, senderDetail);
    columns = cols;
    contact = data;
  } else {
    columns = table?.columns || [];
    const { ...c } = addressBookDetail?.contactinfo?.columns || {};
    contact = c as Omit<ContactColumnSchema, 'contact_id'>;
  }

  const [c] = sortColumns(columns, contact);
  columns = c as PropertySchema[];
  let phone = '';
  let email = '';
  columns.forEach(({ type, id }) => {
    if (id && contact[id]) {
      if (type === 'PHONE NUMBER') {
        phone = contact[id] as string;
      } else if (type === 'EMAIL') {
        email = contact[id] as string;
      }
    }
  });

  const icons = [
    { name: 'phone-1', href: `tel:${phone}`, onClick: undefined, isLink: true, isVisible: !!phone },
    // { name: 'chat-1', href: '', onClick: undefined, isLink: false },
    {
      name: 'email-1',
      href: `mailto:${email}`,
      onClick: undefined,
      isLink: true,
      isVisible: !!email,
    },
    // { name: 'overflow', onClick: undefined },
  ];
  const filteredIcons = icons.filter(({ isVisible }) => isVisible);

  return filteredIcons.length === 0 ? (
    <Box />
  ) : (
    <Stack {...props}>
      {filteredIcons.map(({ name, isLink, href, onClick }) =>
        isLink ? (
          <Link href={href} key={name}>
            <Icon name={name} size="1.5rem" />
          </Link>
        ) : (
          <IconButton
            // @ts-ignore
            icon={name}
            key={name}
            aria-label="chat"
            color="#333"
            fontSize="1.5rem"
            lineHeight="1.5rem"
            padding="0"
            height="auto"
            minWidth="auto"
            onClick={onClick}
          />
        ),
      )}
    </Stack>
  );
}

function FooterItem({ name, children, ...props }: FlexProps & { name: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Flex className="more-info-footer-item" flexDirection="column" overflowY="hidden" {...props}>
      <PseudoBox
        as="button"
        display="flex"
        cursor="pointer"
        alignItems="center"
        justifyContent="flex-start"
        _focus={{ outline: 'none' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Icon height="1rem" name={isExpanded ? 'chevron-down' : 'chevron-right'} />

        <Text
          color="#000"
          fontWeight={500}
          fontSize=".75rem"
          lineHeight="1rem"
          marginLeft="0.5rem"
          letterSpacing=".05rem"
          textTransform="uppercase"
        >
          {name}
        </Text>
      </PseudoBox>

      {isExpanded && children && children}

      <Box
        height="1px"
        marginTop="1rem"
        marginRight="3.75rem"
        backgroundColor="rgba(213, 219, 230, 0.5)"
      />
    </Flex>
  );
}

const Footer = ({ ...props }: FlexProps) => {
  const items = [
    {
      name: 'Details',
      view: (
        <>
          <Contact paddingTop="1.5rem" gap="1rem 1.5rem" templateColumns="repeat(2, 1fr)" />
        </>
      ),
    },
    {
      name: 'Notes',
      view: <Note />,
    },
  ];

  return (
    <Flex className="more-info-footer" flexDirection="column" {...props}>
      {items.map(({ name, view }) => (
        <FooterItem key={name} name={name} paddingTop="1rem">
          {view}
        </FooterItem>
      ))}
    </Flex>
  );
};

export function UserOverview({ toggleUserOverview, onUserOverViewToggled }: UserOverviewProps) {
  const params = useParams<{ id: string }>();
  const thread =
    useSelector((state: RootState) =>
      selectThreadDetailByID(state, params.id === 'new' ? '' : params.id),
    ) || INBOX_INIT.thread;
  const senderDetail = useSelector((state: RootState) =>
    selectCustomerByID(state, thread?.sender_id || ''),
  );
  const threadReceiverUserID = useSelector((state: RootState) =>
    selectThreadReceiverPlatformID(state, params.id === 'new' ? '' : params.id),
  );
  const sender_name = useSelector((state: RootState) =>
    selectName(state, 
      { 
        id: thread.sender_id,
        // @ts-ignore
        credentialUserID: threadReceiverUserID 
      }),
  );

  if (toggleUserOverview === 'none') {
    return <Box />;
  }

  if (toggleUserOverview === 'mini') {
    return thread.uuid ? (
      <Stack spacing="1.5rem" backgroundColor="white" paddingX="1.25rem" paddingTop="1.5rem">
        <Button
          paddingX="0"
          variant="ghost"
          height="initial"
          minWidth="initial"
          onClick={() => onUserOverViewToggled()}
        >
          <Icon name="go-back" size="1rem" color="#333333" />
        </Button>

        <Avatar
          as="button"
          size="sm"
          src={senderDetail?.image_url}
          name={sender_name}
          onClick={() => onUserOverViewToggled()}
        />
      </Stack>
    ) : (
      <Box />
    );
  }

  return (
    <Flex
      fontSize=".875rem"
      paddingTop="1.875rem"
      paddingLeft="1.5rem"
      flexDirection="column"
      backgroundColor="white"
      width={['100%', '100%', '100%', '394px']}
    >
      <IconButton
        icon="close"
        aria-label="close-more-info"
        variant="ghost"
        variantColor="blue"
        color="#333"
        width="1.5rem"
        height="1.5rem"
        padding=".25rem"
        marginRight="2rem"
        minWidth="auto"
        alignSelf="flex-end"
        onClick={() => onUserOverViewToggled()}
      />

      <Avatar
        size="xl"
        marginTop=".625rem"
        src={senderDetail?.image_url}
        onClick={() => onUserOverViewToggled()}
        name={sender_name}
      />

      <Text
        marginY="1rem"
        fontSize="1.25rem"
        paddingRight="3.75rem"
        fontWeight={500}
        lineHeight="1.625rem"
        color="#333"
      >
        {sender_name}
      </Text>

      <Icons isInline paddingRight="3.75rem" spacing="1.25rem" marginBottom="1.5rem" />

      <Box height="1px" backgroundColor="rgba(213, 219, 230, 0.5)" marginRight="3.75rem" />

      <Footer flex={1} minWidth="13.875rem" overflowY="hidden" />
    </Flex>
  );
}
