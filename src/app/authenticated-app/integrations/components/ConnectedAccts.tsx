import React, { useState } from 'react';
import { Stack, Text, Flex, Link, Avatar } from '@chakra-ui/core';
import { ConnectedAccountDataProps, ConnectedAccountProps } from '../integrations.type';
import { ConfirmModal, Button } from 'app/components';
import { CredentialSchema, selectActiveOrgChannelCredentials } from '../../channels';
import { requestAccessUrls } from '../../channels/channels.data';
import { RootState } from '../../../../root';
import { useSelector } from 'react-redux';
import { CustomerSchema, INBOX_INIT, selectCustomerById } from '../../inbox';
import { ChannelConnectBtn } from '../../channels/components';

type AccountSchema = {
  user: Pick<CustomerSchema, 'platform_name' | 'platform_nick'>;
  credential_id: CredentialSchema['uuid'];
};

function AcctItem({
  customer_id,
  credential_id,
  index,
  baseUrl,
  disconnectBtnText,
  onAccountDeleteSelect,
}: {
  index: number;
  customer_id: string;
  credential_id: string;
  onAccountDeleteSelect: (item: AccountSchema) => void;
} & Pick<ConnectedAccountDataProps, 'baseUrl' | 'disconnectBtnText'>) {
  const { image_url, platform_name, platform_nick } =
    useSelector((state: RootState) => selectCustomerById(state, customer_id)) ||
    INBOX_INIT.customer;

  return (
    <Flex
      key={platform_nick}
      alignItems="center"
      paddingY="1.1875rem"
      borderTop={index === 0 ? 'none' : 'solid 1px rgba(0, 0, 0, 0.08)'}
    >
      {image_url && (
        <Avatar
          src={image_url}
          name={platform_name || platform_nick}
          marginRight=".5rem"
          size="sm"
        />
      )}

      {platform_nick && baseUrl ? (
        <Link
          isExternal
          href={`${baseUrl}/${platform_nick}`}
          fontWeight={600}
          fontSize=".875rem"
          color="#3d50df"
        >
          {`@${platform_nick}`}
        </Link>
      ) : (
        <Text fontWeight={600} fontSize=".875rem" color="#3d50df">
          {platform_name}
        </Text>
      )}

      <Button
        variant="ghost"
        variantColor="red"
        fontSize=".75rem"
        leftIcon="delete"
        height="auto"
        marginLeft="auto"
        padding=".25rem .5rem"
        onClick={() =>
          onAccountDeleteSelect({ credential_id, user: { platform_name, platform_nick } })
        }
      >
        {disconnectBtnText || 'Remove'}
      </Button>
    </Flex>
  );
}

export function ConnectedAccounts({
  history,
  channel,
  disconnectAccount,
  isDisconnectLoading,
  handleModelOpen,
  isModalOpen,
  data: { subHeading, baseUrl, disconnectBtnText = '' },
}: ConnectedAccountProps) {
  const [selectedAccount, setSelectedAccount] = useState<AccountSchema>({
    user: { platform_nick: '', platform_name: '' },
    credential_id: '',
  });

  const accounts = useSelector((state: RootState) =>
    selectActiveOrgChannelCredentials(state, channel),
  );

  const {
    credential_id,
    user: { platform_nick, platform_name },
  } = selectedAccount;
  const addMoreText = `+ Add${accounts.length > 0 ? '  more' : ''}`;

  const handleAccountDeleteSelect = (item: AccountSchema) => {
    handleModelOpen(true);
    setSelectedAccount(item);
  };

  return (
    <>
      <Text
        fontWeight={500}
        textAlign="center"
        color={channel !== 'phone' ? 'rgba(17, 17, 17, 0.5)' : 'initial'}
      >
        Connected Account
      </Text>

      <Text marginTop="1.875rem" fontSize=".75rem" opacity={0.5}>
        {subHeading}
      </Text>

      <Stack spacing=".5rem">
        {accounts.length === 0 ? (
          <Text fontSize=".875rem" marginTop=".5rem">
            No account connected yet
          </Text>
        ) : (
          accounts.map(({ user_id, uuid }, index) => (
            <AcctItem
              key={uuid}
              index={index}
              baseUrl={baseUrl}
              customer_id={user_id}
              credential_id={uuid}
              disconnectBtnText={disconnectBtnText}
              onAccountDeleteSelect={handleAccountDeleteSelect}
            />
          ))
        )}
      </Stack>

      {['instagram'].includes(channel) ? (
        <Link
          isExternal
          href={requestAccessUrls[channel]}
          fontSize=".875rem"
          fontWeight={500}
          marginTop=".5em"
          _hover={{
            textDecoration: 'none',
          }}
        >
          {addMoreText}
        </Link>
      ) : (
        <ChannelConnectBtn which={channel}>
          <Button
            variant="unstyled"
            fontSize=".875rem"
            fontWeight={500}
            height="auto"
            marginTop=".5em"
          >
            {addMoreText}
          </Button>
        </ChannelConnectBtn>
      )}

      <Text fontSize=".875rem" marginTop="3.5rem" textAlign="center">
        Subscription is due on
        <Text as="span" fontWeight={600}>
          {' '}
          August 21st, 2021
        </Text>
      </Text>

      <Flex marginTop="1rem" justifyContent="center">
        <Link
          isExternal
          href="/s/settings/organization/billing"
          fontWeight={500}
          fontSize=".875rem"
          color="#3d50df"
          textDecoration="underline"
        >
          View billing to cancel subscription
        </Link>
      </Flex>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => handleModelOpen(false)}
        title={`Disconnect ${platform_nick && baseUrl ? platform_nick : platform_name}`}
        description="Performing this action will close all the open and unassigned conversations of the account."
        isLoading={isDisconnectLoading}
        onConfirm={() => disconnectAccount(platform_nick || platform_name || '', credential_id)}
      />
    </>
  );
}
