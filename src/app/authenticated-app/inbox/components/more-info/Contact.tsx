import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  GridProps,
  Icon,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverCloseButton,
  PopoverTrigger,
  PseudoBox,
  Stack,
  Text,
  Flex,
  Image,
} from '@chakra-ui/core';
import { PROPERTIES_ICONS, PropertySchema } from '../../../tables/components';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize, isEmpty } from 'lodash';
import {
  addContact,
  addTableColumn,
  searchContactList,
  selectAddressBookDetailByID,
  selectContactTable,
  selectCustomerByID,
  selectName,
  selectThreadDetailByID,
  updateContact,
} from '../../slices';
import { RootState } from '../../../../../root';
import { TablePropertiesOptions } from '../../../tables';
import { ContactColumnSchema, CustomerSchema } from '../../inbox.types';
import { mergeContact, sortColumns, transformSenderToContact } from '../../inbox.utils';
import { useParams } from 'react-router-dom';
import { INBOX_INIT } from '../../inbox.data';
import { Field } from '../../../lists/components/record-modal/index.component';
import { GridColumnMenu } from '../../../lists/components/grid/column-menu';
import noSearch from '../../no-search.svg';
import { selectThreadReceiverPlatformID } from '../../../channels';

function Heading({
  table,
  ...item
}: PropertySchema & {
  table: TablePropertiesOptions | undefined;
}) {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const { type, label } = item;

  const handleOnEnterPressed = (event: any) => {
    event.stopPropagation();
    if (event.key !== 'Enter') return;

    event.target.blur();
  };

  const handleBlur = async () => {
    if (table && item && value && label.toLowerCase() !== value.toLowerCase()) {
      try {
        await dispatch(
          addTableColumn({
            ...table,
            columns: table.columns.map(column => {
              if (column.id !== item.id) {
                return column;
              }

              return {
                ...item,
                label: capitalize(value),
                name: value.toLowerCase(),
              };
            }),
          }),
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (value !== label) {
      setValue(label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return (
    <Stack isInline spacing=".5rem" alignItems="center">
      <Icon name={PROPERTIES_ICONS[type.toLowerCase()]} />

      <Input
        flex={1}
        value={value}
        onKeyPress={handleOnEnterPressed}
        onBlur={handleBlur}
        onChange={(e: any) => setValue(e.target.value)}
      />
    </Stack>
  );
}

function ContactItem({
  table,
  contact,
  contact_id,
  ...item
}: PropertySchema & {
  uid?: string | number;
  value: string;
  contact_id?: string;
  contact: Omit<ContactColumnSchema, 'contact_id'>;
  table: TablePropertiesOptions | undefined;
}) {
  const { label, value } = item;
  const dispatch = useDispatch();

  const updateCellValue = async (value: any, columnID: any) => {
    if (contact && contact_id && contact[columnID] !== value) {
      contact[columnID] = value;
      const result: any = await dispatch(
        updateContact({
          contact_id,
          contact,
        }),
      );

      if (updateContact.rejected.match(result)) {
        console.log(result.error.message);
      }
    }
  };

  const addSelectOption = (columnID: any, value: any) => {
    console.log(value, columnID);
  };

  const updateSelectOption = (columnID: any, optionID: any, payload: any) => {
    console.log(columnID, optionID, payload);
  };

  return (
    <>
      <Heading table={table} {...item} />

      <Field
        {...{
          value: value,
          column: item,
          updateCellValue,
          updateSelectOption,
          addSelectOption,
          placeholder: `Add ${label}`,
        }}
      />
    </>
  );
}

function NewProperty({ table }: { table: TablePropertiesOptions | undefined }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const INITIAL_PROPERTY_VALUE = {
    name: '',
    type: 'TEXT',
    hidden: false,
    label: '',
  };
  const [property, setProperty] = useState<PropertySchema>(INITIAL_PROPERTY_VALUE);

  const handleNewContactProperty = async () => {
    if (table && property) {
      try {
        await dispatch(addTableColumn({ ...table, columns: [...table.columns, property] }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeColumnMenu = async () => {
    property.label && handleNewContactProperty();
    setIsOpen(false);
    setProperty(INITIAL_PROPERTY_VALUE);
  };

  const handleUpdateColumnLabel = (columnID: string, label: string) => {
    setProperty({
      ...property,
      label: capitalize(label),
      name: label.toLowerCase(),
    });
  };

  const handleUpdateColumnType = (columnID: string, type: string) => {
    setProperty({ ...property, type: type.toUpperCase() });
  };

  const handleUpdateColumn = (columnID: string, payload: any) => {
    const { label, type } = payload;
    setProperty({
      ...property,
      type: type || property.type,
      label: capitalize(label),
      name: label.toLowerCase(),
    });
  };

  const colID = 'add-new-property';

  return (
    <>
      {!!isOpen && (
        <GridColumnMenu
          columnID={colID}
          // @ts-ignore
          column={property}
          isOpen={!!isOpen}
          close={closeColumnMenu}
          updateLabel={handleUpdateColumnLabel}
          updateType={handleUpdateColumnType}
          updateColumn={handleUpdateColumn}
          updateCustomization={() => ''}
        />
      )}

      <div col-id={colID}>
        <Button
          variant="ghost"
          variantColor="blue"
          fontSize=".75rem"
          lineHeight=".875rem"
          leftIcon="add"
          height="auto"
          minWidth="auto"
          padding=".25rem"
          _focus={{ boxShadow: 'none' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          Add a property
        </Button>
      </div>
    </>
  );
}

function UpdateContact({ onAddContact, table_id, children }: any) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>('');
  const [searchedContacts, setSearchedContacts] = useState<any[]>();
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const resetAfterSubmit = () => {
    setSearch('');
    setSearchedContacts([]);
  };

  const handleAddContact = (contactToBeUpdated: any) => {
    onAddContact(contactToBeUpdated);
    resetAfterSubmit();
  };

  const handleContactSearch = async (value?: string) => {
    setSearch(value || '');
    const fc: any = await dispatch(
      searchContactList({
        table_id,
        query: value,
      }),
    );

    if (searchContactList.fulfilled.match(fc)) {
      setSearchedContacts(fc.payload);
    } else {
      console.log(fc.error.message);
    }
  };

  useEffect(() => {
    handleContactSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popover initialFocusRef={initialFocusRef} closeOnBlur={false}>
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent zIndex={1500} maxWidth="initial" width="auto" paddingY="1.25rem">
        <PopoverCloseButton size="1rem" color="#3f536e" right="1.5rem" top=".75rem" />

        <PopoverBody paddingX="3.125rem">
          <Text fontSize="1.125rem" fontWeight={600}>
            Update Contact
          </Text>

          <Text fontSize=".75rem" marginTop="1.6875rem">
            Select contact to update.
          </Text>

          <Input
            type="text"
            placeholder="Search Contact..."
            border="none"
            borderBottom="solid 1px rgba(17, 17, 17, 0.1)"
            padding="1rem 0"
            height="auto"
            borderRadius="0"
            _focus={{
              boxShadow: 'none',
              borderColor: 'rgba(17, 17, 17, 0.1)',
            }}
            ref={initialFocusRef}
            value={search}
            onChange={({ target: { value } }: any) => handleContactSearch(value)}
          />

          <Box overflowY="hidden" marginX="-3rem">
            <Box overflowY="auto" height="300px" paddingX="2.725rem">
              {searchedContacts && searchedContacts.length > 0 ? (
                searchedContacts
                  .map(item => item.name)
                  .map((itemName, index) => (
                    <PseudoBox
                      key={searchedContacts[index].id}
                      as="p"
                      marginTop=".625rem"
                      marginX="-.5rem"
                      padding=".5rem"
                      _hover={{
                        backgroundColor: 'rgba(119, 131, 253, 0.05)',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleAddContact(searchedContacts[index])}
                    >
                      {itemName}
                    </PseudoBox>
                  ))
              ) : (
                <Flex
                  display="flex"
                  textAlign="center"
                  alignItems="center"
                  paddingTop="1.25rem"
                  justifyContent="center"
                  flexDirection="column"
                  color="rgb(0, 0, 0, 0.5)"
                  borderTop="solid 1px #e9edf0"
                >
                  <Image src={noSearch} width="80px" />
                  <Text>No Result Found</Text>
                  <Text
                    fontSize=".75rem"
                    marginTop=".25rem"
                  >{`We couldn't find any matches for "${search}"`}</Text>
                </Flex>
              )}
            </Box>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export function Contact({ ...props }: GridProps) {
  const params = useParams<{ id: string }>();
  const thread_id = params.id;

  //@ts-ignore
  const { address_book_id, sender_id } =
    useSelector((state: RootState) =>
      selectThreadDetailByID(state, params.id === 'new' ? '' : params.id),
    ) || INBOX_INIT.thread;
  const table = useSelector(selectContactTable);
  const addressBookDetail = useSelector((state: RootState) =>
    selectAddressBookDetailByID(state, address_book_id || ''),
  );
  let senderDetail = useSelector((state: RootState) => selectCustomerByID(state, sender_id || ''));

  const threadReceiverUserID = useSelector((state: RootState) =>
    selectThreadReceiverPlatformID(state, params.id === 'new' ? '' : params.id),
  );
  const sender_name = useSelector((state: RootState) =>
    selectName(state, 
      { 
        id: sender_id,
        // @ts-ignore
        credentialUserID: threadReceiverUserID 
      }),
  );
  senderDetail = { ...senderDetail, platform_name: sender_name } as CustomerSchema;

  let columns: TablePropertiesOptions['columns'] = [];
  let contact: Omit<ContactColumnSchema, 'contact_id'> = {};
  let contact_id = '';

  if (!addressBookDetail && table && senderDetail) {
    const [cols, data] = transformSenderToContact(table, senderDetail);
    columns = cols;
    contact = data;
  } else {
    columns = table?.columns || [];
    const { contact_id: cID = '', ...c } = addressBookDetail?.contactinfo?.columns || {};
    contact_id = cID;
    contact = c as Omit<ContactColumnSchema, 'contact_id'>;
  }

  const [sortedColumns, haveValueLength] = sortColumns(columns, contact);
  columns = sortedColumns as PropertySchema[];
  const dispatch = useDispatch();
  const [contactBtnLoader, setContactBtnLoader] = useState(false);

  const handleAddContact = async (contactToBeUpdated?: any) => {
    const { columns: c, ...restOfTable } = table || {};
    if (columns && contact && !isEmpty(restOfTable) && thread_id) {
      try {
        let contactQ = contact;
        if (!isEmpty(contactToBeUpdated)) {
          contactQ = mergeContact(contact, contactToBeUpdated?.columns, columns);
        }

        setContactBtnLoader(true);
        await dispatch(
          addContact({
            columns,
            restOfTable,
            thread_id,
            contact: contactQ,
            contact_id: contactToBeUpdated?.id,
            customer_id: sender_id,
          }),
        );
      } catch (error) {
        console.log(error);
      }
      setContactBtnLoader(false);
    }
  };

  return (
    <>
      <Grid
        paddingRight="1.5rem"
        fontSize=".75rem"
        className="contact-detail"
        flex={1}
        overflowY="auto"
        {...props}
      >
        {(address_book_id ? columns : columns.slice(0, haveValueLength as number)).map(item => (
          <ContactItem
            key={item.id}
            table={table}
            contact_id={contact_id}
            contact={contact}
            value={contact[item.id || ''] as any}
            {...item}
          />
        ))}
      </Grid>

      <Stack isInline justifyContent="flex-start" marginTop="1.5rem" spacing=".5rem">
        {address_book_id ? (
          <NewProperty table={table} />
        ) : (
          <>
            <Button
              variant="ghost"
              variantColor="blue"
              fontSize=".75rem"
              lineHeight=".875rem"
              leftIcon="add"
              height="auto"
              minWidth="auto"
              padding=".25rem"
              marginRight=".5rem"
              _focus={{ boxShadow: 'none' }}
              loadingText="Adding contact"
              isLoading={contactBtnLoader}
              onClick={() => handleAddContact()}
            >
              Add Contact
            </Button>

            <UpdateContact onAddContact={handleAddContact} table_id={table?.id}>
              <Button
                variant="ghost"
                variantColor="blue"
                fontSize=".75rem"
                lineHeight=".875rem"
                leftIcon="edit"
                height="auto"
                minWidth="auto"
                padding=".25rem"
                _focus={{ boxShadow: 'none' }}
              >
                Update Contact
              </Button>
            </UpdateContact>
          </>
        )}
      </Stack>
    </>
  );
}
