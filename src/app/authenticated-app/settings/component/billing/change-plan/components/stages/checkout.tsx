import React, { useState } from 'react';
import { Box, Divider, Radio, useToast } from '@chakra-ui/core/dist';
import { formatCurrency } from '../../../../../../../../utils';
import { CardItemWrapper } from '../../component.styles';
import { useSelector } from 'react-redux';
import { selectWalletEmail, selectWalletID } from '../../../../../../payments/selectors';
import { selectProfile } from '../../../../../../../unauthenticated-app/authentication';
import { useHistory } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { ToastBox, Button } from '../../../../../../../components';

interface ItemProps {}

const CardItem = (props: any) => (
  <CardItemWrapper onClick={props.onClick}>
    <Box display="flex" width="100%">
      <img
        alt="credit card"
        className="card-logo"
        src={`/images/credit-cards/${props.brand}.svg`}
      />
      <Box>
        <Box className="text-primary">{`••••  ${props.last4}`}</Box>
        <Box className="text-secondary">{`Exp ${props.exp_month}/${props.exp_year}`}</Box>
      </Box>
    </Box>

    <Radio isChecked={props.isSelected} onChange={() => {}} />
  </CardItemWrapper>
);

interface Props {
  plan: any;
  billing_period: 'monthly' | 'yearly';
  billing_currency: 'ngn' | 'usd';
  cards: any[];
  selectedCard: any;
  setSelectedCard: Function;
  fetchSubscription: Function;
  fetchWallet: Function;
  fetchCards: Function;
  createSubscription: Function;
}

export const CheckoutSubscriptionPlan = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [cardPaymentLoading, setCardPaymentLoading] = useState(false);
  const {
    plan,
    billing_period,
    billing_currency,
    cards,
    selectedCard,
    setSelectedCard,
    fetchSubscription,
    fetchWallet,
    fetchCards,
    createSubscription,
  } = props;

  const wallet_email = useSelector(selectWalletEmail);
  const wallet_id = useSelector(selectWalletID);

  const router_history = useHistory();

  const toast = useToast();

  const { first_name, last_name, organisation_id } = useSelector(selectProfile) || {
    first_name: '',
    last_name: '',
  };

  const paystack_config = {
    amount:
      billing_period === 'monthly' ? plan['price_monthly']['ngn'] : plan['price_yearly']['ngn'],
    email: wallet_email ?? '',
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    label: `${plan['name']}`,
    first_name,
    last_name,
    metadata: {
      wallet_id,
      refund: false,
      save_card: true,
      purpose: 'subscription-purchase',
      subscription_plan: plan['id'],
      billing_period: billing_period,
    },
  };

  // @ts-ignore
  const initializePayment = usePaystackPayment(paystack_config);

  const handlePaySuccess = () => {
    setLoading(true);
    setTimeout(async () => {
      await fetchSubscription(organisation_id);
      fetchWallet(organisation_id);
      fetchCards();
      setLoading(false);
      router_history.push('/s/settings/organization/billing');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${plan['name']} subscription activated successfully`}
          />
        ),
      });
    }, 2000);
  };

  const handleCardPayment = async () => {
    setCardPaymentLoading(true);
    const res = await createSubscription({
      subscription_plan: plan['id'],
      billing_period: billing_period,
      card: selectedCard,
      auto_renew: true,
    });

    if (res) {
      fetchWallet(organisation_id);
      fetchCards();
      setCardPaymentLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${plan['name']} subscription activated successfully`}
          />
        ),
      });
      router_history.push('/s/settings/organization/billing');
    } else {
      setCardPaymentLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Unable to create for subscription, please try another card or payment method"
          />
        ),
      });
    }
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" my="50px">
      <Box maxW="450px" width="100%" display="flex" flexDirection="column">
        {cards.length > 0 && (
          <>
            {cards.map((card: any, index: number) => (
              <CardItem
                {...card}
                key={index}
                isSelected={selectedCard === card.id}
                onClick={() => setSelectedCard(card.id)}
              />
            ))}
            <Box mt="15px" display="flex" flexDirection="column" alignItems="center">
              <Button
                mt="20px"
                size="sm"
                isFullWidth
                variant="solid"
                variantColor="blue"
                onClick={handleCardPayment}
                isLoading={cardPaymentLoading}
              >
                Checkout
              </Button>
              <Button
                mt="20px"
                size="sm"
                variant="link"
                variantColor="blue"
                isLoading={loading}
                onClick={() => initializePayment(handlePaySuccess)}
              >
                Use new payment method
              </Button>
            </Box>
          </>
        )}

        {cards.length === 0 && (
          <Box width="100%" display="flex" flexDirection="column" alignItems="center" my="30px">
            <Box fontWeight="500" fontSize="18px">
              No cards available
            </Box>
            <Box
              fontWeight="400"
              fontSize="14px"
              textAlign="center"
              color="#757575"
              mt="15px"
              width="80%"
            >
              Looks like you haven't added any cards on Simpu, once you checkout with a new one,
              you'll be able to use it for other payments right here on Simpu
            </Box>
            <Button
              mt="25px"
              size="sm"
              variant="solid"
              variantColor="blue"
              isLoading={loading}
              onClick={() => initializePayment(handlePaySuccess)}
            >
              Checkout with new payment method
            </Button>
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        width="350px"
        backgroundColor="#FFFFFF"
        boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        borderRadius="20px"
        padding="30px"
        height="fit-content"
      >
        <Box fontSize="14px" fontWeight="500" color="#757575">
          Bill summary
        </Box>
        <Box fontWeight="600" mt="5px" fontSize="25px">
          {plan.name}
        </Box>
        <Divider my="10px" />
        <Box fontWeight="500" fontSize="14px" color="#757575">
          Total price {billing_period}
        </Box>
        <Box fontSize="20px" fontWeight="500">
          {billing_currency === 'ngn' ? '₦' : '$'}{' '}
          {plan.type !== 'enterprise'
            ? billing_period === 'monthly'
              ? formatCurrency(plan.price_monthly[billing_currency] / 100)
              : formatCurrency(plan.price_yearly[billing_currency] / 100)
            : '💰'}
        </Box>

        {billing_period === 'yearly' && (
          <Box mt="15px">
            <Box fontWeight="500" fontSize="14px" color="#757575">
              Total savings with yearly plan:
            </Box>
            <Box fontWeight="500" fontSize="14px" color="#27c459">
              {billing_currency === 'ngn' ? '₦' : '$'}{' '}
              {formatCurrency(
                (plan.price_monthly[billing_currency] * 12 - plan.price_yearly[billing_currency]) /
                  100,
              )}
            </Box>
          </Box>
        )}

        <Box></Box>
      </Box>
    </Box>
  );
};
