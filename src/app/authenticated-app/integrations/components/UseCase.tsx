import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Input,
  PseudoBox,
  FormControl,
  FormLabel,
  Icon
} from '@chakra-ui/core';
import { PhoneSchema } from '../integrations.type';
import { Button } from 'app/components';
import { Dropdown } from './Dropdown';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrganisations } from '../../settings/slices';
import { connectChannelAcct, ErrorModalProps } from '../../channels';
import { ErrorModal } from '../../channels/components';

export function UseCase() {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation<PhoneSchema>();
  const organisations = useSelector(selectOrganisations);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorDetail, setErrorDetail] = useState<Pick<ErrorModalProps, 'title' | 'description'>>({
    title: 'Error! Failed to buy phone number',
    description: '',
  });

  const [formData, setFormData] = useState<any>({
    companyName: '',
    industry: '',
    role: '',
    companySize: '',
  });
  const { isOpen: isModalOpen, onClose: onModalClose, onOpen: onModalOpen } = useDisclosure();

  const items: { icon: string; title: string; description: string }[] = [
    { icon: 'briefcase', title: 'Work', description: 'You need a phone number for your business.' },
    { icon: 'user', title: 'Personal', description: 'You need it for personal reasons.' },
  ];

  const formItems: {
    type: string;
    name: string;
    label: string;
    placeholder: string;
    list?: string[];
  }[] = [
    { type: 'input', name: 'companyName', label: 'Company Name', placeholder: 'Enter name' },
    {
      type: 'select',
      name: 'industry',
      label: 'Industry',
      placeholder: 'Select industry',
      list: [
        'Aerospace and Defense',
        'Agriculture and Forestry',
        'Automotive',
        'Banks',
        'Chemicals',
        'Civic, Non-Profit and Membership Groups',
        'Computer Hardware',
        'Computer Software',
        'Construction and Building Materials',
        'Consumer Products',
        'Consumer Services',
        'Corporate Services',
        'Electronics',
        'Energy and Environmental',
        'Financial Services',
        'Food and Beverage',
        'Government',
        'Holding Companies ',
        'Hospitals and Healthcare',
        'Industrial Manufacturing and Services',
        'Insurance',
        'Leisure, Sports and Recreation',
        'Media',
        'Mining and Metals',
        'Pharmaceuticals and Biotech',
        'Real Estate Services',
        'Retail',
        'Schools and Education',
        'Telecommunications',
        'Transportation',
      ],
    },
    { type: 'input', name: 'role', label: 'Your Role', placeholder: 'Choose your role', list: [] },
    {
      type: 'select',
      name: 'companySize',
      label: 'Company Size',
      placeholder: 'Select your size',
      list: [
        '1',
        '2-10',
        '11-50',
        '51-200',
        '201-500',
        '501-1000',
        '1001-5000',
        '5001-10,000',
        '10,000+',
      ],
    },
  ];

  const handleItemClicked = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (location.state?.phone_number) {
      const result: any = await dispatch(
        connectChannelAcct({
          channel: 'phone',
          useCaseData: formData?.companySize ? formData : undefined,
          phone_number:
            process.env.NODE_ENV === 'development' ? '+15005550006' : location.state.phone_number,
        }),
      );
      if (connectChannelAcct.fulfilled.match(result)) {
        history.push('/s/integrations/sms');
      } else {
        if (result?.error?.message) {
          isModalOpen === true && onModalClose();
          setErrorDetail({ ...errorDetail, description: result.error.message });
          setIsErrorModalOpen(true);
        }
      }
    }
  };

  useEffect(() => {
    if (organisations && organisations.length > 0) {
      const [org] = organisations;
      setFormData({ ...formData, companyName: org.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisations]);

  useEffect(() => {
    if (!location.state) {
      history.push('/s/integrations/phone');
    }
  }, [history, location.state]);

  if (!location.state) {
    return <Box />;
  }

  return (
    <Box height="100vh" backgroundColor="white">
      <Box p="1rem">
        <Button size="sm" variant="ghost" leftIcon="chevron-left" onClick={() => history.goBack()}>
          Back
        </Button>
      </Box>
      <Box paddingTop="3.25rem" marginX="auto" maxWidth="20.125rem" color="brandBlack">
        <Text fontSize="1.125rem" fontWeight={600}>
          What’s your use case?
        </Text>

        <Text fontSize=".875rem" color="rgba(46, 56, 77, 0.5)" marginTop="1rem">
          Help us provide the best in class experience.
        </Text>

        {items.map(({ icon, title, description }) => (
          <PseudoBox
            key={title}
            display="flex"
            alignItems="center"
            marginTop="3.125rem"
            cursor="pointer"
            onClick={title === 'Work' ? onModalOpen : handleItemClicked}
          >
            <Icon name={icon} size="3rem" />

            <Box marginLeft=".625rem">
              <Text fontWeight={600} marginBottom=".5rem">
                {title}
              </Text>
              <Text color="rgba(17, 17, 17, 0.5)" fontSize=".75rem">
                {description}
              </Text>
            </Box>
          </PseudoBox>
        ))}

        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody marginX="auto" width="18.125rem" paddingY="3.125rem">
              <Text fontSize="1.125rem" fontWeight={600}>
                Your Company
              </Text>

              <Text
                marginBottom="3.125rem"
                fontSize=".875rem"
                color="rgba(46, 56, 77, 0.5)"
                marginTop="1rem"
              >
                Setup your company Profile
              </Text>

              <form onSubmit={(event: FormEvent<HTMLFormElement>) => handleItemClicked(event)}>
                {formItems.map(({ type, label, placeholder, list, name }, index) => (
                  <FormControl key={label} marginTop={index === 0 ? '0' : '1.25rem'}>
                    <FormLabel fontSize=".625rem" color="rgba(17, 17, 17, 0.5)">
                      {label}
                    </FormLabel>

                    {type === 'input' ? (
                      <Input
                        isRequired
                        placeholder={placeholder}
                        fontSize=".875rem"
                        paddingX="0"
                        paddingY=".75rem"
                        border="none"
                        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
                        name={name}
                        value={formData[name]}
                        onChange={({ target: { name: n, value } }: ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, [n]: value })
                        }
                      />
                    ) : (
                      <Dropdown
                        list={(list || []).map(value => ({ value, label: value }))}
                        placeholder={placeholder}
                        selected={{ value: formData[name], label: formData[name] }}
                        setSelected={item => setFormData({ ...formData, [name]: item.value })}
                      />
                    )}
                  </FormControl>
                ))}

                <Button
                  isDisabled={!(formData.industry && formData.companySize)}
                  variantColor="blue"
                  type="submit"
                  marginTop="1.875rem"
                  width="100%"
                >
                  Continue
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        <ErrorModal {...errorDetail} isOpen={isErrorModalOpen} setIsOpen={setIsErrorModalOpen} />
      </Box>
    </Box>
  );
}
