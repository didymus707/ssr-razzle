import { Box, Heading, Stack, Text, useDisclosure, useToast } from '@chakra-ui/core';
import React from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ConfirmModal, EmptyState, ToastBox, Button } from '../../../../components';
import { selectApiKeys } from '../../selectors';
import { APIKey } from '../../settings.types';
import { revokeAPIKey, generateAPIKey } from '../../thunks';
import { APIKeyItem } from './api-key-item';
import { NewAPIKeyModal } from './new-api-key-modal';
import launchApp from './launch-app.svg';

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = RouteComponentProps & PropsFromRedux;

const connector = connect(null, { revokeAPIKey, generateAPIKey });

export const APIKeys = connector((props: Props) => {
  const { revokeAPIKey, generateAPIKey } = props;

  const toast = useToast();
  const apiKeys = useSelector(selectApiKeys);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isLoading, setIsLoading] = React.useState(false);
  const [apiKey, setApiKey] = React.useState<string | undefined>();
  const [apiKeyToDelete, setApiKeyToDelete] = React.useState<APIKey | undefined>();

  const handleRevokeAPIKey = async () => {
    if (apiKeyToDelete) {
      try {
        setIsLoading(true);
        await revokeAPIKey(apiKeyToDelete);
        setIsLoading(false);
        setApiKeyToDelete(undefined);
      } catch (error) {
        setIsLoading(false);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    }
  };

  const handleGenerateAPIKey = async () => {
    try {
      setIsLoading(true);
      //@ts-ignore
      const { auth_key } = await generateAPIKey();
      setApiKey(auth_key.key);
      setIsLoading(false);
      onOpen();
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleCloseNewAPIKeyModal = () => {
    setApiKey(undefined);
    onClose();
  };

  return (
    <>
      <Stack
        mb="2rem"
        isInline
        spacing="0"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box pb="0.5rem">
          <Heading pb="0.2rem" fontSize="1.2rem" color="#333333" fontWeight="semibold">
            Standard keys
          </Heading>
          <Text color="black" fontSize="0.8rem">
            These keys will allow you to authenticate API requests
          </Text>
        </Box>
        <Button
          size="sm"
          variantColor="blue"
          leftIcon="small-add"
          isLoading={isLoading}
          onClick={handleGenerateAPIKey}
        >
          Generate secret key
        </Button>
      </Stack>

      <Box pb="180px">
        {apiKeys.length ? (
          <>
            <Stack
              isInline
              pt="1rem"
              spacing="1rem"
              flexWrap="wrap"
              alignItems="center"
              borderBottomWidth="1px"
            >
              <Box
                marginBottom="1rem"
                width={['calc(50% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}
              >
                <Text
                  fontWeight="500"
                  fontSize="0.875rem"
                  color="gray.900"
                  textTransform="uppercase"
                >
                  Token
                </Text>
              </Box>
              <Box
                marginBottom="1rem"
                width={['calc(50% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}
              >
                <Text
                  fontWeight="500"
                  fontSize="0.875rem"
                  color="gray.900"
                  textTransform="uppercase"
                >
                  Status
                </Text>
              </Box>
              <Box
                marginBottom="1rem"
                width={['calc(50% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}
              >
                <Text
                  fontWeight="500"
                  fontSize="0.875rem"
                  color="gray.900"
                  textTransform="uppercase"
                >
                  Created
                </Text>
              </Box>
              <Box
                marginBottom="1rem"
                width={['calc(25% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}
              ></Box>
            </Stack>
            {apiKeys.map(item => (
              <APIKeyItem key={item.id} item={item} onRevokeKey={setApiKeyToDelete} />
            ))}
          </>
        ) : (
          <EmptyState
            py="100px"
            imageSize="120px"
            image={launchApp}
            heading="No API keys generated yet"
            contentContainerProps={{ mt: '1rem' }}
          />
        )}
      </Box>
      <ConfirmModal
        title="Revoke API Key"
        isLoading={isLoading}
        isOpen={!!apiKeyToDelete}
        onConfirm={handleRevokeAPIKey}
        onClose={() => setApiKeyToDelete(undefined)}
      />
      <NewAPIKeyModal apiKey={apiKey} isOpen={isOpen} onClose={handleCloseNewAPIKeyModal} />
    </>
  );
});
