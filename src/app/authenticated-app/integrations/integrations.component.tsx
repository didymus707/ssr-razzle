import React, { ReactElement, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  FormControl,
  FormLabel,
  Icon,
} from '@chakra-ui/core';
import {
  Switch,
  Route,
  RouteComponentProps,
  useParams,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { ConfirmModal, ContentWrapper, EmptyState, ToastBox, Button } from 'app/components';
import {
  UseCase,
  Subscription,
  Phone,
  PhoneIntegration,
  WebMessengerIntegration,
  WhatsApp,
} from './components';
import { IntegrationProps } from './integrations.type';
import emptyViewImage from './empty.svg';
import { Wrapper } from '../lists/lists.styles';
import { apps, getErrorFromQuery } from '../channels/channels.data';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../root';
import {
  disconnectCredential,
  ErrorModalProps,
  selectActiveOrgChannelCredentialIDs,
  selectIsCredentialConnected,
  submitDetailToBeNotify,
} from '../channels';
import { INBOX_INIT, selectCustomerById } from '../inbox';
import { ChannelConnectBtn, ErrorModal } from '../channels/components';
import ReactMarkdown from 'react-markdown';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectView = (
  which: string,
  profile: any,
  history: RouteComponentProps['history'],
): { name: string; description: string; view: ReactElement } | undefined => {
  const anyView = (
    <Box mt="10rem">
      <EmptyState
        imageSize="250px"
        heading="Channel not supported yet"
        subheading="Support coming soon"
        image={emptyViewImage}
      />
    </Box>
  );

  switch (which) {
    case 'web-messenger':
      return {
        name: 'Web Messenger',
        view: <WebMessengerIntegration />,
        description: `Create an SMS channel by assigning one or more of your virtual mobile numbers and use it to send and receive messages.
You can add numbers from different countries and our API will pick the best number to send your message from based on the recipient's country code.`,
      };
    case 'whatsapp':
      return {
        name: 'WhatsApp',
        view: anyView,
        description: 'Connect WhatsApp directly to Simpu, to receive DMs.',
      };
    case 'messenger':
      return {
        name: 'Facebook Messenger',
        view: anyView,
        description: 'Connect Messenger directly to Simpu, to receive DMs.',
      };
    case 'instagram':
      return {
        name: 'Instagram',
        view: anyView,
        description: 'Connect Instagram directly to Simpu, to receive DMs.',
      };
    case 'web-chat':
      return {
        name: 'Website Live Chat',
        view: anyView,
        description: 'Embed live chat into your website.',
      };
    case 'ios':
      return {
        name: 'iOS SDK',
        view: anyView,
        description: 'Allow customers speak to you directly from their iOS devices.',
      };
    case 'android':
      return {
        name: 'Android SDK',
        view: anyView,
        description: 'Allow customers speak to you directly from their Android devices.',
      };
    default: {
      history.push('/s/channels');
    }
  }
};

function AccountItem({
  customer_id,
  credential_id,
  index,
}: {
  index: number;
  customer_id: string;
  credential_id: string;
}) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisconnectLoading, setIsDisconnectLoading] = useState(false);

  const { image_url, platform_name, platform_nick } =
    useSelector((state: RootState) => selectCustomerById(state, customer_id)) ||
    INBOX_INIT.customer;

  const disconnectAccount = async () => {
    setIsDisconnectLoading(true);
    const response: any = await dispatch(disconnectCredential({ credential_id }));

    if (disconnectCredential.fulfilled.match(response)) {
      setIsModalOpen(false);

      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${platform_nick || platform_name} account disconnected successfully`}
          />
        ),
      });
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Error! Failed to remove channel" />
        ),
      });
    }

    setIsDisconnectLoading(false);
  };

  return (
    <>
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

        <Text fontWeight={600} fontSize=".875rem" color="#3d50df">
          {platform_name}
        </Text>

        <Button
          variant="ghost"
          variantColor="red"
          fontSize=".75rem"
          leftIcon="delete"
          height="auto"
          marginLeft="auto"
          padding=".25rem .5rem"
          onClick={() => setIsModalOpen(true)}
        >
          Remove
        </Button>
      </Flex>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={disconnectAccount}
        isLoading={isDisconnectLoading}
        onClose={() => setIsModalOpen(false)}
        title={`Disconnect ${platform_nick || platform_name}`}
        description="Performing this action will delete all the conversations associated with this account."
      />
    </>
  );
}

function ConnectedAcct({ channel }: { channel: string }) {
  const accounts = useSelector((state: RootState) =>
    selectActiveOrgChannelCredentialIDs(state, channel),
  );
  return (
    <Box backgroundColor="#f6fafd" borderRadius=".375rem">
      <Stack spacing=".5rem" maxWidth="322px" marginX="auto">
        {accounts.length === 0 ? (
          <Text fontSize=".875rem" marginTop=".5rem">
            No account connected yet
          </Text>
        ) : (
          accounts.map(({ user_id, credential_id }, index) => (
            <AccountItem
              key={credential_id}
              index={index}
              customer_id={user_id}
              credential_id={credential_id}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}

function ChannelIntegration() {
  const toast = useToast();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const params = useParams<{ channel: string }>();
  const { channel } = params;
  const [notifyText, setNotifyText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingNotifyBtn, setIsSubmittingNotifyBtn] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [errorDetail, setErrorDetail] = useState<Pick<ErrorModalProps, 'title' | 'description'>>({
    title: '',
    description: '',
  });
  const { name, status, description, icon, key } = apps[channel];
  const isConnected = useSelector((state: RootState) =>
    selectIsCredentialConnected(state, channel),
  );
  const addMoreTexts = {
    request: 'Request for Access',
    ready: `Add${isConnected ? '  more' : ''}`,
    undone: 'Notify Me When Available',
  };
  const tabHeaders: {
    title: string;
    body: JSX.Element;
  }[] = [
    {
      title: 'Description',
      body: <ReactMarkdown>{description}</ReactMarkdown>,
    },
  ];

  if (isConnected) {
    tabHeaders.unshift({ title: 'Connected Accounts', body: <ConnectedAcct channel={channel} /> });
  }

  if (status !== 'undone') {
    tabHeaders.push({ title: 'Permisssion', body: <Box /> });
  }

  const onNotifySubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmittingNotifyBtn(true);
    const r: any = await dispatch(
      submitDetailToBeNotify({
        channel,
        email: notifyText,
      }),
    );
    if (submitDetailToBeNotify.fulfilled.match(r)) {
      setIsNotifyModalOpen(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Email Saved!" />
        ),
      });
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Error! Failed to submit the email" />
        ),
      });
    }

    setIsSubmittingNotifyBtn(false);
  };

  useEffect(() => {
    const { search } = location;
    if (search) {
      const error = getErrorFromQuery(search);
      error && setErrorDetail(error);
      error.description && setIsModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <ContentWrapper paddingBottom="1rem" paddingTop="3.125rem">
      <Wrapper>
        <Box className="side-bar" marginTop="-4rem">
          <Button
            variant="ghost"
            marginLeft="-1rem"
            variantColor="blue"
            marginBottom="1.5rem"
            leftIcon="chevron-left"
            onClick={() => history.goBack()}
          >
            Go Back
          </Button>

          <Flex justifyContent="center" alignItems="center">
            <Icon name={icon || key} size="13.125rem" />
          </Flex>

          {status === 'undone' ? (
            <Button
              width="100%"
              variant="solid"
              marginTop="2rem"
              variantColor="green"
              onClick={() => setIsNotifyModalOpen(true)}
            >
              {addMoreTexts[status]}
            </Button>
          ) : (
            <ChannelConnectBtn which={channel}>
              <Button width="100%" variant="solid" marginTop="2rem" variantColor="green">
                {addMoreTexts[status]}
              </Button>
            </ChannelConnectBtn>
          )}
        </Box>

        <Box className="content">
          <Box className="section-title">
            <Text className="title">{name}</Text>
          </Box>

          <Tabs color="brandBlack" fontSize=".875rem">
            <TabList>
              {tabHeaders.map(({ title }) => (
                <Tab fontSize=".875rem" key={title}>
                  {title}
                </Tab>
              ))}
            </TabList>

            <TabPanels marginTop="1.5rem">
              {tabHeaders.map(({ title, body }) => (
                <TabPanel key={title}>{body}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Wrapper>

      <Modal isCentered isOpen={isNotifyModalOpen} onClose={() => setIsNotifyModalOpen(false)}>
        <ModalOverlay />
        <ModalContent backgroundColor="white" paddingBottom="1.5rem" borderRadius=".25rem">
          <ModalBody fontSize=".875rem">
            <Text marginY="1.5rem" fontWeight="bold">
              {`Notify me when ${name} is available`}
            </Text>

            <form onSubmit={onNotifySubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="email" marginBottom=".25rem" fontSize=".875rem">
                  Email
                </FormLabel>

                <Input
                  id="email"
                  type="email"
                  fontSize=".875rem"
                  value={notifyText}
                  onChange={(e: any) => setNotifyText(e.target.value)}
                  placeholder="Please enter your email"
                />
              </FormControl>

              <Stack isInline spacing=".5rem" marginTop="1.5rem" justifyContent="flex-end">
                <Button
                  type="button"
                  variant="ghost"
                  fontSize=".875rem"
                  variantColor="blue"
                  onClick={() => setIsNotifyModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="solid"
                  fontSize=".875rem"
                  variantColor="blue"
                  isLoading={isSubmittingNotifyBtn}
                >
                  Submit Request
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ErrorModal {...errorDetail} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </ContentWrapper>
  );
}

export function IntegrationsComponent({
  user,
  profile,
  randomPhone,
  resetRandomPhone,
  useCaseData,
  resetUseCaseData,
  buyPhone,
}: IntegrationProps) {
  return (
    <Switch>
      <Route
        path="/s/integrations/sms-integration"
        render={(props: any) => (
          <PhoneIntegration channel="sms" user={user} profile={profile} {...props} />
        )}
      />
      <Route
        path="/s/integrations/voice-integration"
        render={(props: any) => (
          <PhoneIntegration channel="voice" user={user} profile={profile} {...props} />
        )}
      />
      <Route
        path="/s/integrations/subscription/phone"
        render={(props: any) => (
          <Subscription
            user={user}
            random_phone={randomPhone}
            resetRandomPhone={resetRandomPhone}
            use_case_data={useCaseData}
            resetUseCaseData={resetUseCaseData}
            buyPhone={buyPhone}
            profile={profile}
            {...props}
          />
        )}
      />
      <Route path="/s/integrations/use-case/phone" render={props => <UseCase />} />
      <Route path="/s/integrations/phone" render={props => <Phone />} />
      <Route path="/s/integrations/_whatsapp" render={() => <WhatsApp />} />
      <Route path="/s/integrations/:channel" render={() => <ChannelIntegration />} />
    </Switch>
  );
}
