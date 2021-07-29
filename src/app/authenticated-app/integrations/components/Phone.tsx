import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Input,
  Stack,
  useToast,
  PseudoBox,
  CheckboxGroup,
  Checkbox,
  Spinner,
  Skeleton,
  Icon,
} from '@chakra-ui/core';
import { isEmpty } from 'lodash';
import { PhoneSchema } from '../integrations.type';
import { Dropdown, DropDownItemSchema } from './Dropdown';
import { ToastBox, Button } from 'app/components';
import { joinStrings } from '../integrations.utis';
import { getFlagEmoji } from '../../inbox/inbox.utils';
import { useDispatch, useSelector } from 'react-redux';
import { getPotentialAccts, getSupportedCountries, selectSupportedCountries } from '../../channels';
import { useHistory } from 'react-router-dom';

type PhoneQuerySchema = {
  pattern: string;
  tab: string;
  types: string[];
};

export function Phone() {
  const history = useHistory<PhoneSchema>();
  const dispatch = useDispatch();
  const toast = useToast();
  const supportedCountries = useSelector(selectSupportedCountries);
  const { isOpen: isModalOpen, onClose: onModalClose, onOpen: onModalOpen } = useDisclosure();
  const countries: DropDownItemSchema[] = supportedCountries.map(
    ({ country: label, country_code: value }) => ({ value, label }),
  );

  const [selectedCountry, setSelectedCountry] = useState(supportedCountries[0]);
  const [tabIndex, setTabIndex] = useState(0);
  const [modalQueries, setModalQueries] = useState<PhoneQuerySchema>({
    pattern: '',
    tab: '',
    types: [],
  });
  const [randomPhoneLoader, setRandomPhoneLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const [phoneListLoader, setPhoneListLoader] = useState(false);
  const [randomPhone, setRandomPhone] = useState<PhoneSchema | undefined>();
  const [searchedPhones, setSearchedPhones] = useState<PhoneSchema[]>([]);
  const [phoneTypes, setPhoneTypes] = useState<string[]>([]);

  const isCaOrUs = ['US', 'CA'].includes(selectedCountry?.country_code);
  const {
    friendly_name,
    capabilities: randomPhoneCapabilities,
    type: randomPhoneType,
  } = randomPhone || {
    friendly_name: '',
    capabilities: [],
    type: '',
  };

  const continueToNext = () => {
    history.push('/s/integrations/use-case/phone', randomPhone);
  };

  const searchForPhones = async (query: PhoneQuerySchema) => {
    const tabKeys = ['type', 'inRegion', 'areaCode'];
    const { tab, pattern: contains, types } = query;
    const { country_code, country } = selectedCountry;

    if (!contains || contains?.length > 1) {
      setPhoneListLoader(true);

      try {
        const response = await dispatch(
          getPotentialAccts({
            contains,
            country,
            country_code,
            [tabKeys[tabIndex]]: tabIndex === 0 ? types : tab,
            channel: 'phone',
          }),
        );
        setSearchedPhones((response as any).payload?.list || []);
      } catch (error) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }

      return setPhoneListLoader(false);
    }

    return setSearchedPhones([]);
  };

  const handleTabChange = async (index: number) => {
    const query = { ...modalQueries, tab: '', types: [] };
    setModalQueries(query);
    setTabIndex(index);

    if (modalQueries.pattern) {
      await searchForPhones(query);
    }
  };

  const handleModalQueryChange = async (
    event?: ChangeEvent<HTMLInputElement>,
    checks?: { name: string; value: (string | number | undefined)[] },
  ) => {
    let data: { name: string; value: any } = { name: '', value: '' };
    if (event) {
      data = event.target;
    } else if (checks) {
      data = checks;
    }

    const { name, value } = data;

    const query = { ...modalQueries, [name]: value };
    setModalQueries(query);

    await searchForPhones(query);
  };

  const handleCountrySelect = async (
    item: DropDownItemSchema = { value: 'US', label: 'United State' },
  ) => {
    setSelectedCountry({ country: item.label, country_code: item.value });

    try {
      setRandomPhoneLoader(true);

      const response = await dispatch(
        getPotentialAccts({
          channel: 'phone',
          country_code: item.value,
        }),
      );

      const {
        list: phones,
        country_phone_types,
      }: {
        list: PhoneSchema[];
        country_phone_types: string[];
      } = (response as any).payload;
      setSearchedPhones(phones);
      setRandomPhone(phones[Math.floor(Math.random() * phones.length)]);
      setModalQueries({ ...modalQueries, types: country_phone_types });
      setPhoneTypes(country_phone_types);
      setRandomPhoneLoader(false);
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleModalClose = () => {
    onModalClose();
    setTabIndex(0);
    setModalQueries({ pattern: '', tab: '', types: [] });
    setSearchedPhones([]);
  };

  const handlePhoneSelect = (index: number) => {
    setRandomPhone(searchedPhones[index]);
    handleModalClose();
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await dispatch(getSupportedCountries());
        await handleCountrySelect();
        setPageLoader(false);
      } catch (error) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box height="100vh" backgroundColor="white">
      <Box p="1rem">
        <Button size="sm" variant="ghost" leftIcon="chevron-left" onClick={() => history.goBack()}>
          Go back to directory
        </Button>
      </Box>
      <Box paddingTop="3.25rem" marginX="auto" maxWidth="20.125rem" color="brandBlack">
        {pageLoader ? (
          <Box textAlign="center">
            <Spinner color="blue.500" size="md" />
          </Box>
        ) : (
          <>
            <Text fontSize="1.125rem" fontWeight={600}>
              Generate preferred phone number
            </Text>

            <Text fontSize=".875rem" color="rgba(46, 56, 77, 0.5)" marginTop="1rem">
              You can add more multiple phone numbers later.
            </Text>

            <Text marginTop="3.125rem" fontSize=".625rem" color="rgba(17, 17, 17, 0.5)">
              Choose country
            </Text>

            <Dropdown
              list={countries}
              setSelected={handleCountrySelect}
              selected={{
                value: selectedCountry?.country_code || '',
                label: selectedCountry?.country || '',
              }}
              formatOptionLabel={({ value, label }: any) => (
                <Flex alignItems="center">
                  <Text fontSize="1.125rem" marginRight="0.625rem">
                    <span role="img" aria-label="country emoji">
                      {getFlagEmoji(value)}
                    </span>
                  </Text>

                  <Text>{label}</Text>
                </Flex>
              )}
            />

            <Text marginTop="1.25rem" fontSize=".625rem" color="rgba(17, 17, 17, 0.5)">
              Area Code
            </Text>

            <Dropdown
              list={[{ value: 'Random', label: 'Random' }]}
              selected={{ value: 'Random', label: 'Random' }}
            />

            {friendly_name && (
              <Box
                marginTop="2.5rem"
                paddingY=".625rem"
                paddingX=".875rem"
                backgroundColor="rgba(0, 0, 0, 0.03)"
                position="relative"
                textAlign="center"
              >
                <Button
                  variant="unstyled"
                  minWidth="initial"
                  height="initial"
                  position="absolute"
                  top="1.3125rem"
                  right=".875rem"
                  onClick={() =>
                    handleCountrySelect({
                      label: selectedCountry.country,
                      value: selectedCountry.country_code,
                    })
                  }
                >
                  {randomPhoneLoader ? (
                    <Box size="1.25rem">
                      <Spinner size="sm" color="blue.500" />
                    </Box>
                  ) : (
                    <Icon name="update" size="1.25rem" />
                  )}
                </Button>

                <Text>{randomPhone?.friendly_name}</Text>
                <Flex justifyContent="center" color="rgba(17, 17, 17, 0.5)" fontSize=".75rem">
                  <Text>{`(${randomPhoneType})`}</Text>
                  <Text marginLeft=".5rem">{`(${joinStrings(randomPhoneCapabilities)})`}</Text>
                </Flex>
              </Box>
            )}

            <Button
              isFullWidth
              color="white"
              fontSize=".875rem"
              marginTop=".625rem"
              variantColor="blue"
              onClick={() => continueToNext()}
            >
              Continue
            </Button>

            <Box textAlign="center">
              <Button
                variant="unstyled"
                fontSize=".875rem"
                marginTop=".4375rem"
                onClick={onModalOpen}
              >
                Pick a different number?
              </Button>
            </Box>

            <Modal size="xl" isOpen={isModalOpen} onClose={handleModalClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody paddingTop="3.125rem">
                  <Text fontSize="1.125rem" fontWeight={600}>
                    Generate preferred phone number
                  </Text>

                  <Text fontSize=".875rem" color="rgba(46, 56, 77, 0.5)" marginTop="1rem">
                    You can add more multiple phone numbers later.
                  </Text>

                  <Tabs
                    marginTop="3.125rem"
                    paddingTop="1rem"
                    paddingBottom="1.5rem"
                    backgroundColor="rgba(0, 0, 0, 0.02)"
                    borderRadius="0.4167rem"
                    onChange={(index: number) => handleTabChange(index)}
                  >
                    <TabList borderBottom="none" marginX="2.5rem" justifyContent="space-between">
                      {['BY TYPE', 'BY LOCATION', 'BY AREA CODE'].map((item, index) => (
                        <Tab
                          key={item}
                          opacity={0.5}
                          _selected={{
                            color: '#3d50df',
                            borderBottom: '3px solid #3d50df',
                            outline: 'none',
                            opacity: 'unset',
                            paddingBottom: '.5rem',
                          }}
                          fontWeight={500}
                          paddingX=".5rem"
                          paddingBottom=".625rem"
                          disabled={index >= 1 ? !isCaOrUs : false}
                        >
                          {item}
                        </Tab>
                      ))}
                    </TabList>

                    <TabPanels marginX="2.8125rem" marginTop="3.4375rem">
                      {[
                        'Select phone type(s)',
                        'Enter a 2-letter state or province abbreviation (e.g. AR)',
                        'Enter an area code (e.g. 210)',
                      ].map((item, index) => (
                        <TabPanel key={`${item}-${index}`}>
                          {index === 0 ? (
                            <Box
                              borderBottom="1px solid rgba(0, 0, 0, 0.08)"
                              paddingBottom="0.5rem"
                            >
                              <Text
                                color="rgba(17, 17, 17, 0.5)"
                                fontSize=".75rem"
                                marginBottom=".5rem"
                              >
                                {item}
                              </Text>

                              <CheckboxGroup
                                display="flex"
                                justifyContent="space-between"
                                size="sm"
                                variantColor="blue"
                                onChange={value =>
                                  handleModalQueryChange(undefined, { name: 'types', value })
                                }
                                value={modalQueries.types}
                              >
                                {['Local', 'Mobile', 'Toll-free'].map(title => (
                                  <Checkbox
                                    key={title}
                                    value={title.toLowerCase()}
                                    isDisabled={!phoneTypes.includes(title.toLowerCase())}
                                  >
                                    {title}
                                  </Checkbox>
                                ))}
                              </CheckboxGroup>
                            </Box>
                          ) : (
                            <Flex
                              alignItems="center"
                              borderBottom="1px solid rgba(0, 0, 0, 0.08)"
                              paddingBottom="1.25rem"
                            >
                              <Icon name="marker" size="1.1875rem" />

                              <Input
                                fontSize=".875rem"
                                placeholder={item}
                                marginLeft=".875rem"
                                backgroundColor="transparent"
                                border="none"
                                name="tab"
                                maxLength={tabIndex === 1 ? 2 : 3}
                                value={modalQueries.tab}
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                  handleModalQueryChange(event)
                                }
                              />
                            </Flex>
                          )}

                          <Flex alignItems="center" paddingTop="1.25rem">
                            <Icon name="dial-number-secondary" size="1.0625rem" />

                            <Input
                              fontSize=".875rem"
                              placeholder="Filter by digits or phrases"
                              marginLeft=".875rem"
                              backgroundColor="transparent"
                              border="none"
                              name="pattern"
                              value={modalQueries.pattern}
                              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                handleModalQueryChange(event)
                              }
                            />
                          </Flex>

                          <Stack spacing="1.875rem" marginTop="2.5rem">
                            {phoneListLoader ? (
                              Array(4)
                                .fill(Math.random())
                                .map((item, index) => (
                                  <Skeleton key={`${index}-${item}`} height="1.5rem" />
                                ))
                            ) : !Object.values(modalQueries).every(item => isEmpty(item)) &&
                              searchedPhones.length === 0 ? (
                              <Text fontSize=".875rem">No matches found for the search query</Text>
                            ) : (
                              searchedPhones.map(
                                (
                                  {
                                    friendly_name,
                                    locality,
                                    type: phoneType,
                                    capabilities: phoneCapabilities,
                                  },
                                  index,
                                ) => (
                                  <PseudoBox
                                    display="flex"
                                    alignItems="center"
                                    key={friendly_name}
                                    cursor="pointer"
                                    color="rgba(17, 17, 17, 0.5)"
                                    fontSize=".75rem"
                                    _hover={{ bg: 'rgba(119, 131, 253, 0.03)', cursor: 'pointer' }}
                                    _focus={{
                                      bg: 'rgba(119, 131, 253, 0.03)',
                                      outline: 'none',
                                      cursor: 'pointer',
                                    }}
                                    tabIndex={0}
                                    onClick={() => handlePhoneSelect(index)}
                                  >
                                    <input type="radio" name="phone" value={friendly_name} />
                                    <Text fontSize="1rem" color="brandBlack" marginLeft="1.875rem">
                                      {friendly_name}
                                    </Text>
                                    <Text marginLeft=".5rem">{`(${phoneType})`}</Text>
                                    <Text marginLeft=".25rem">{`(${joinStrings(
                                      phoneCapabilities,
                                    )})`}</Text>
                                    {locality && (
                                      <Text marginLeft="auto">
                                        {locality.length > 15
                                          ? `${locality.substr(0, 15)}...`
                                          : locality}
                                      </Text>
                                    )}
                                  </PseudoBox>
                                ),
                              )
                            )}
                          </Stack>
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Box>
    </Box>
  );
}
