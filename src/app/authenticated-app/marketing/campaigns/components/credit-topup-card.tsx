import { Box, Heading, Stack, Text, useDisclosure } from '@chakra-ui/core';
import React from 'react';
import { Button } from 'app/components';
import { connect, useSelector } from 'react-redux';
import { RootState } from '../../../../../root';
import { fetchWallet } from '../../../payments';
import { CreditTopupModal } from './credit-topup-modal';
import { formatToCurrency } from '../../../inbox/inbox.utils';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';

interface CreditTopCardUIProps {
  cards: any[];
  wallet_id: any;
  content: string;
  amount?: number;
  default_card: any;
  billingData?: any;
  wallet_email?: any;
  credit_balance: number;
  fetchWallet: (organization_id: any) => void;
}

function mapStateToProps(state: RootState) {
  return {
    cards: state.payment.cards,
    wallet_id: state.payments.wallet.data.id,
    wallet_email: state.payments.wallet.data.email,
    default_card: state.payments.wallet.data.card_default,
    credit_balance: state.payments.wallet.data.credit_balance,
    billingData: state.billing.subscription.data,
  };
}

const mapDispatchToProps = {
  fetchWallet,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const CreditTopupCardUI = ({
  cards,
  amount,
  content,
  wallet_id,
  fetchWallet,
  billingData,
  wallet_email,
  default_card,
  credit_balance,
}: CreditTopCardUIProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const organisationId = useSelector(selectOrganisationID);

  return (
    <>
      <Box p="0.75rem 1rem" bg="#e8f7ff" rounded="5px">
        <Stack pb="0.5rem">
          <Heading fontSize="0.875rem" size="sm" fontWeight={500}>
            Campaign Credit: {formatToCurrency(credit_balance)}
          </Heading>
          <Text fontSize="0.75rem">{content}</Text>
        </Stack>
        <Button variantColor="blue" size="xs" onClick={onOpen}>
          Top up now
        </Button>
      </Box>
      <CreditTopupModal
        cards={cards}
        amount={amount}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        wallet_id={wallet_id}
        fetchWallet={fetchWallet}
        billingData={billingData}
        wallet_email={wallet_email}
        default_card={default_card}
        // @ts-ignore
        organisationId={organisationId}
      />
    </>
  );
};

export const CreditTopupCard = connector(CreditTopupCardUI);
