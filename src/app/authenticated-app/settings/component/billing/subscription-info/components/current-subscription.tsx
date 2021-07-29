import React from 'react';
import { Box, Divider } from '@chakra-ui/core/dist';
import { useHistory } from 'react-router-dom';
import { formatCurrency } from '../../../../../../../utils';
import moment from 'moment';
import { Button } from 'app/components';

interface Props {
  plan: { [key: string]: any };
  subscription: { [key: string]: any };
}

export const CurrentSubscription = (props: Props) => {
  const { plan, subscription } = props;
  const router_history = useHistory();

  const { billing_period } = subscription;
  const { type: planType, price_monthly, price_yearly } = plan;

  return (
    <Box className="current-sub-card">
      <Box className="title-section">
        <Box>
          <Box className="billing-period">
            Your subscription plan {planType !== 'free' && `(billed ${billing_period})`}
          </Box>
          <Box className="subscription-name">{plan.name}</Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Button
            size="sm"
            variant="solid"
            variantColor="blue"
            onClick={() => router_history.push('/s/settings/organization/billing/upgrade')}
          >
            Upgrade plan
          </Button>
          {planType === 'standard' && (
            <Box marginTop="5px" fontSize="14px" color="#757575" fontWeight="500">
              Expires on {moment(subscription.expiry).format('DD/MM/YYYY')}
            </Box>
          )}
        </Box>
      </Box>
      <Divider marginY="10px" />

      <Box className="item">
        <Box className="label">{subscription.details.organization.users} user seat(s)</Box>
      </Box>

      <Box className="item">
        <Box className="label">
          {subscription.details.organization.teams || 'Unlimited'} team(s)
        </Box>
      </Box>

      <Box className="item">
        <Box className="label">
          {subscription.details.inbox.max_channels || 'Unlimited'} social channels
        </Box>
      </Box>

      <Box className="item">
        <Box className="label">
          {subscription.details.lists.lists || 'Unlimited'} lists (1000 rows each)
        </Box>
      </Box>

      <Divider marginY="10px" />

      <Box className="item">
        <Box className="label">Total {billing_period} charge</Box>
        <Box className="price_total">
          ₦{' '}
          {planType !== 'enterprise'
            ? billing_period === 'monthly'
              ? formatCurrency(price_monthly['ngn'] / 100)
              : formatCurrency(price_yearly['ngn'] / 100)
            : '💰'}
        </Box>
      </Box>
    </Box>
  );
};
