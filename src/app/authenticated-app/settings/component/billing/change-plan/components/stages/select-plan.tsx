import React from 'react';
import { Box, Icon } from '@chakra-ui/core';
import { formatCurrency } from '../../../../../../../../utils';
import { useSelector } from 'react-redux';
import { selectActiveSubscriptionPlan } from '../../../../../selectors';
import { Button } from 'app/components';

const plan_features = [
  ['Unlimited social channels', 'One user seat', 'Three teams', 'Three lists(1000 rows each))'],
  ['Everything in Inbox', '25 user seats', 'Unlimited teams', 'Unlimited lists'],
  ['Everything in Business', 'Custom pricing', 'Higher volume rates', '24/7 enterprise support'],
];

const PlanItem = (props: any) => {
  const {
    index,
    name,
    description,
    price_monthly,
    price_yearly,
    features,
    type: planType,
    onSelectPlan,
    billing_period,
    billing_currency,
  } = props;

  const active_plan = useSelector(selectActiveSubscriptionPlan);

  return (
    <Box className={`plan-item ${index !== 1 && 'blurred'}`}>
      <Box className="title">{name}</Box>
      <Box className="description">{description}</Box>
      <Box className="pricing">
        <Box className="amount">
          <span className="currency">{billing_currency === 'ngn' ? '₦' : '$'}</span>
          {planType !== 'enterprise'
            ? billing_period === 'monthly'
              ? formatCurrency(price_monthly[billing_currency] / 100)
              : formatCurrency(price_yearly[billing_currency] / 100)
            : '💰'}
        </Box>
        <Box className="info">
          <Box verticalAlign="top">billed {billing_period}</Box>
        </Box>
      </Box>

      {features.map((i: string, ft_index: number) => (
        <Box key={ft_index} className={`feature-item ${ft_index === 0 && index !== 0 && 'bold'}`}>
          <Icon name="check" className="icon" />
          {i}
        </Box>
      ))}

      {planType === 'standard' && (
        <>
          {props.id === active_plan.id ? (
            <Box
              margin="auto"
              fontWeight="500"
              fontSize="12px"
              color="#16c13c"
              padding="5px 10px"
              backgroundColor="#ddf5dd"
              borderRadius="5px"
            >
              Current Subscription
            </Box>
          ) : (
            <Button marginY="23px" size="sm" variantColor="blue" onClick={onSelectPlan}>
              Checkout
            </Button>
          )}
        </>
      )}
      {planType === 'enterprise' && (
        <Button
          size="sm"
          marginY="23px"
          variant="link"
          variantColor="blue"
          onClick={() => {
            window.location.href = 'mailto:info@simpu.co';
          }}
        >
          Contact Sales
        </Button>
      )}
    </Box>
  );
};

export const SelectSubscriptionPlan = (props: any) => {
  const { plans, checkout, billing_period, billing_currency } = props;

  return (
    <Box className="section-plans">
      {plans.map((plan: any, index: number) => (
        <PlanItem
          key={index}
          index={index}
          {...plan}
          features={plan_features[index]}
          onSelectPlan={() => checkout(plan)}
          billing_period={billing_period}
          billing_currency={billing_currency}
        />
      ))}
    </Box>
  );
};
