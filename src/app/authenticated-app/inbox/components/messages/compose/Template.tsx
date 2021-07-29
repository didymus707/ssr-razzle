import {
  Box,
  Flex,
  Icon,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  PseudoBox,
  Stack,
} from '@chakra-ui/core';
import { getQuickReplies } from 'app/authenticated-app/inbox/inbox.service';
import { BodyText, Button, Heading3, SmallText } from 'app/components';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../root';
import { selectOrganisationID } from '../../../../../unauthenticated-app/authentication';
import { QuickReplySchema } from '../../../inbox.types';
import { parseTemplate, transformSenderToContact } from '../../../inbox.utils';
import {
  selectAddressBookByOrgIDAndCustomerID,
  selectColumnById,
  selectContactTable,
  selectCustomerByID,
} from '../../../slices';

type Template = QuickReplySchema & { is_favourite: boolean };

export function Template({
  isOpen,
  setText,
  contact_id,
  setIsOpen,
  sender_id,
  setIsTemplateMode,
}: {
  sender_id: string;
  contact_id?: string;
  isOpen?: boolean;
  setIsOpen?: (v: boolean) => void;
  setIsTemplateMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setText: (text: string, isTemplateMode?: boolean, subject?: string) => void;
}) {
  const [page] = React.useState(1);
  const [search, setSearch] = useState('');
  let [isOpened, setIsOpened] = useState(false);
  const initialFocusRef = useRef<HTMLElement>();
  const [filteredTemplates, setFilteredTemplates] = useState<Template[] | undefined>([]);

  const { data } = useQuery<{ quick_replies: QuickReplySchema[] }, any>(
    ['quick-replies', page],
    () => getQuickReplies({ page }),
  );

  const isModalOpened = isOpen || isOpened;
  const setIsModalOpened = setIsOpen || setIsOpened;

  const contactTable = useSelector(selectContactTable);
  const organisation_id = useSelector(selectOrganisationID) || '';
  const sender = useSelector((state: RootState) => selectCustomerByID(state, sender_id || ''));
  const addressBook = useSelector((state: RootState) =>
    selectAddressBookByOrgIDAndCustomerID(state, { organisation_id, customer_id: sender_id }),
  );
  const contact = useSelector((state: RootState) =>
    selectColumnById(state, contact_id || addressBook?.contact_id || ''),
  );

  const handleClose = () => {
    setIsModalOpened(false);
    setSearch('');
  };

  const handleClick = (template: string, subject?: string) => {
    handleClose();
    let con = contact;
    if (!con && contactTable && sender) {
      const [, c] = transformSenderToContact(contactTable, sender);
      con = c;
    }

    setIsTemplateMode?.(true);
    setText(parseTemplate(template || '', contactTable, con), true, subject);
  };

  const handleChange = (value: string) => {
    setSearch(value);

    setFilteredTemplates(
      data?.quick_replies
        ?.map(reply => ({ ...reply, is_favourite: false }))
        .filter(
          ({ name, template }) =>
            name.toLowerCase().includes(value.toLowerCase()) ||
            template?.subject?.toLowerCase().includes(value.toLowerCase()) ||
            template?.content?.toLowerCase().includes(value.toLowerCase()),
        ),
    );
  };

  useEffect(() => {
    setFilteredTemplates(data?.quick_replies?.map(reply => ({ ...reply, is_favourite: false })));
  }, [data]);

  return (
    <>
      {!setIsOpen && (
        <Button size="xs" variant="ghost" onClick={() => setIsModalOpened(true)}>
          <Icon size="24px" name="inbox-compose-quote" color="gray.600" />
        </Button>
      )}

      <Modal
        isCentered
        size="xl"
        isOpen={isModalOpened}
        // @ts-ignore
        initialFocusRef={initialFocusRef}
        onClose={() => handleClose()}
        closeOnOverlayClick={false}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          width="auto"
          paddingTop="2.5rem"
          borderRadius=".3125rem"
          boxShadow="0px 0px 1px rgba(67, 90, 111, 0.47)"
          minWidth={['300px', '400px', '567px', '567px']}
        >
          <ModalCloseButton size="sm" />

          <Flex
            flexDirection="column"
            paddingX="1.875rem"
            paddingBottom="3.125rem"
            overflowY="hidden"
          >
            <Heading3 color="gray.900">Quick Replies</Heading3>

            <Box marginTop="1.5rem" position="relative">
              <Input
                value={search}
                placeholder="Search Templates"
                borderRadius="2rem"
                backgroundColor="#F6FAFD"
                paddingY=".625rem"
                paddingLeft="2.625rem"
                paddingRight="1rem"
                onChange={(e: any) => handleChange(e.target.value)}
                border="0.5px solid rgba(163, 177, 194, 0.35)"
                // @ts-ignore
                ref={initialFocusRef}
              />

              <Icon
                size="1rem"
                name="search-2"
                position="absolute"
                top=".75rem"
                left="1rem"
                zIndex={2}
              />
            </Box>

            <Stack
              flex={1}
              spacing=".625rem"
              overflowY="auto"
              marginTop="1.875rem"
              marginX="-1.875rem"
              paddingX="1.875rem"
            >
              {(filteredTemplates || []).map(({ is_favourite, name, template, id, uuid }) => (
                <PseudoBox
                  key={uuid}
                  as="button"
                  display="flex"
                  borderRadius="5px"
                  alignItems="flex-start"
                  padding=".75rem .625rem"
                  border="1px solid rgba(213, 219, 230, 0.5)"
                  onClick={() => handleClick(template.content, template.subject)}
                >
                  <Icon
                    name="star"
                    size="1rem"
                    color={is_favourite ? '#F2C94C' : '#fff'}
                    stroke={is_favourite ? undefined : '#828282'}
                  />

                  <Box marginLeft=".625rem" fontSize=".875rem" lineHeight="1rem">
                    <BodyText
                      textAlign="left"
                      color="gray.900"
                      marginBottom=".75rem"
                      fontWeight="bold"
                    >
                      {name}
                    </BodyText>

                    <SmallText
                      width="250px"
                      textAlign="left"
                      color="gray.500"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      style={{ textOverflow: 'ellipsis' }}
                      dangerouslySetInnerHTML={{ __html: template.content }}
                    />
                  </Box>
                </PseudoBox>
              ))}
            </Stack>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
