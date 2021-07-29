import {
  Box,
  Flex,
  Icon,
  Image,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/core';
import { BodyText, Button, Input, SmallText } from 'app/components';
import { useFormik } from 'formik';
import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getReference } from '../../../../../utils';
import { sendAmplitudeData } from '../../../../../utils/amplitude';
import { ModalContainer, ModalContainerOptions, ToastBox } from '../../../../components';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';
import { topupCampaignCredits } from '../campaigns.service';

interface CardItemProps {
  card: any;
  amount: number;
  organisation_id: string;
  default_card: any;
  onClose?(): void;
  fetchWallet: any;
  handleCloseModal(): void;
}

interface CreditTopupModalProps {
  cards: any[];
  onOpen(): void;
  wallet_id: any;
  amount?: number;
  billingData?: any;
  default_card: any;
  wallet_email?: any;
  organisation_id: string;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
  fetchWallet: (organization_id: any) => void;
}

export const CreditTopupModal = (props: CreditTopupModalProps) => {
  const {
    cards,
    isOpen,
    onOpen,
    onClose,
    wallet_id,
    fetchWallet,
    wallet_email,
    default_card,
    amount: amountProps,
  } = props;
  const toast = useToast();
  const { values, errors, handleChange, resetForm } = useFormik({
    initialValues: { amount: amountProps ?? 100 },
    onSubmit: values => console.log(values),
    validationSchema: yup.object().shape({
      amount: yup
        .number()
        .min(100, 'Minimum amount is 100')
        .max(500000, 'Maximum amount is 500,000')
        .required('Amount is required'),
    }),
  });
  const organisationID = useSelector(selectOrganisationID);
  const { amount } = values;
  const amountToPay = amount;
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const commonConfig = {
    email: wallet_email ?? '',
    reference: getReference(),
    publicKey: publicKey || '',
    amount: amountToPay * 100,
  };
  const oneTimePaymentConfig = {
    ...commonConfig,
    metadata: {
      wallet_id,
      save_card: false,
      purpose: 'credit-purchase',
    },
  };
  const addCardConfig = {
    ...commonConfig,
    channels: ['card'],
    metadata: {
      wallet_id,
      save_card: true,
      purpose: 'credit-purchase',
    },
  };
  // @ts-ignore
  const initializeOneTimePayment = usePaystackPayment(oneTimePaymentConfig);
  // @ts-ignore
  const initializeAddCardPayment = usePaystackPayment(addCardConfig);

  const [section, setSection] = React.useState(0);

  const handleCloseModal = () => {
    resetForm();
    setSection(0);
    onClose?.();
  };

  const handleFetchWallet = async () => {
    try {
      await fetchWallet(organisationID);
      handleCloseModal();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Campaign credit successfully purchased"
          />
        ),
      });
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handlePaymentSuccess = () => {
    setTimeout(() => {
      handleFetchWallet();
    }, 2000);
  };

  return (
    <ModalContainer size="md" isOpen={isOpen} onClose={handleCloseModal} title="Topup Credit">
      <ModalCloseButton size="sm" />
      <ModalBody>
        {section === 0 && (
          <>
            <SmallText pb="1rem" color="gray.500">
              Enter the amount you wish to purchase and get the corresponding value in credits
            </SmallText>
            <BodyText pb="0.5rem" fontWeight="bold">
              1 simpu credit = &#8358;1
            </BodyText>
            <Input
              mb="1rem"
              type="number"
              name="amount"
              value={amount}
              onChange={handleChange}
              isInvalid={!!errors.amount}
              errorMessage={errors.amount}
              placeholder="Enter amount in Naira"
            />
            <Input isDisabled value={amountToPay} mb="1rem" placeholder="Simpu Credit" />
            <Button
              mb="1rem"
              isFullWidth
              variantColor="blue"
              onClick={() => setSection(1)}
              isDisabled={!amount || amount < 100}
            >
              Topup
            </Button>
          </>
        )}
        {section === 1 && (
          <>
            <SmallText pb="1.5rem" color="gray.500">
              How would you like to pay for your Simpu campaign credits
            </SmallText>
            <Box height="400px" overflowY="auto">
              <Flex pb="1rem" mb="1rem" alignItems="center" justifyContent="space-between">
                <Stack isInline alignItems="center">
                  <Flex
                    w="50px"
                    h="50px"
                    rounded="6px"
                    bg="gray.200"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name="marketing-one-time-payment" color="#3525E6" size="2rem" />
                  </Flex>
                  <Box>
                    <BodyText color="gray.900">One-time payment</BodyText>
                  </Box>
                </Stack>

                <Stack isInline alignItems="center">
                  <Button
                    size="sm"
                    width="100px"
                    variantColor="blue"
                    isDisabled={!amount}
                    onClick={() => {
                      onClose?.();
                      sendAmplitudeData('campaignTopupOneTimePayment');
                      initializeOneTimePayment(handlePaymentSuccess, onOpen);
                    }}
                  >
                    Pay now
                  </Button>
                </Stack>
              </Flex>

              <Flex pb="1rem" mb="1rem" alignItems="center" justifyContent="space-between">
                <Stack isInline alignItems="center">
                  <Flex
                    w="50px"
                    h="50px"
                    rounded="6px"
                    bg="gray.200"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name="marketing-use-card" color="#3525E6" size="2rem" />
                  </Flex>
                  <Box>
                    <BodyText color="gray.900">Use a new card</BodyText>
                  </Box>
                </Stack>

                <Stack isInline alignItems="center">
                  <Button
                    size="sm"
                    width="100px"
                    variantColor="blue"
                    isDisabled={!amount}
                    onClick={() => {
                      onClose?.();
                      sendAmplitudeData('campaignTopupNewCard');
                      initializeAddCardPayment(handlePaymentSuccess, onOpen);
                    }}
                  >
                    Add card
                  </Button>
                </Stack>
              </Flex>
              {cards.map(i => (
                <CardItem
                  card={i}
                  key={i.id}
                  amount={amount}
                  onClose={onClose}
                  fetchWallet={fetchWallet}
                  default_card={default_card}
                  // @ts-ignore
                  organisation_id={organisationID}
                  handleCloseModal={handleCloseModal}
                />
              ))}
            </Box>
            <Stack isInline alignItems="center">
              <Button mb="1rem" isFullWidth variant="outline" onClick={() => setSection(0)}>
                Back
              </Button>
              <Button mb="1rem" isFullWidth variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Stack>
          </>
        )}
      </ModalBody>
    </ModalContainer>
  );
};

const CardItem = (props: CardItemProps) => {
  const {
    card,
    amount,
    onClose,
    fetchWallet,
    default_card,
    organisation_id,
    handleCloseModal,
  } = props;

  const [isToppingUp, setIsToppingUp] = React.useState(false);

  const toast = useToast();

  const handleUseCard = async () => {
    try {
      setIsToppingUp(true);
      await topupCampaignCredits({ amount: amount * 100, card: card.id });
      await fetchWallet(organisation_id);
      handleCloseModal();
      onClose?.();
      setIsToppingUp(false);
      sendAmplitudeData('campaignTopupWithCard');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Campaign credit successfully purchased"
          />
        ),
      });
    } catch (error) {
      setIsToppingUp(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Sorry, unable to login. Please check your credentials"
          />
        ),
      });
    }
  };

  return (
    <Flex pb="1rem" mb="1rem" key={card.id} alignItems="center" justifyContent="space-between">
      <Stack isInline alignItems="center">
        <Box>
          <Image alt="credit card" src={`/images/credit-cards/${card.brand}.svg`} />
        </Box>
        <Box>
          <BodyText color="gray.900">{`••••  ${card.last4}`}</BodyText>
          <SmallText color="gray.500">{`Exp ${card.exp_month}/${card.exp_year}`}</SmallText>
        </Box>
      </Stack>

      <Stack isInline alignItems="center">
        {card.id === default_card && (
          <Stack isInline alignItems="center">
            <Text color="#1A1A1A" fontSize="0.875rem" fontWeight="400">
              Default
            </Text>
            <Icon size="1rem" name="check-circle" color="#47B881" />
          </Stack>
        )}
        <Button
          size="sm"
          width="100px"
          variantColor="blue"
          isLoading={isToppingUp}
          onClick={() => handleUseCard()}
        >
          Use card
        </Button>
      </Stack>
    </Flex>
  );
};
