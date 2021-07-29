import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Stack, useToast } from '@chakra-ui/core';
import { SwitchWithText } from './SwitchWithText';
import { SubscriptionProps, FeatureSchema, PhoneSchema } from '../integrations.type';
import { PayButton, ToastBox, Button } from 'app/components';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile, selectUserEmail } from '../../../unauthenticated-app/authentication';
import { connectChannelAcct } from '../../channels';

export function Subscription({ buyPhone }: SubscriptionProps) {
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation<{ phone: PhoneSchema; useCaseData: any }>();

  const email = useSelector(selectUserEmail);
  const { first_name, last_name } = useSelector(selectProfile) || {
    first_name: '',
    last_name: '',
  };

  const [isYearly, setIsYearly] = useState(false);
  const [toggleFeatures, setToggleFeatures] = useState(false);

  const voiceFeatures: FeatureSchema[] = [
    { left: 'Unlimited calling' },
    { left: 'Call recording' },
    { left: 'Voicemail with transcriptions' },
  ];

  const smsFeatures: FeatureSchema[] = [
    { left: 'Unlimited texting' },
    { left: 'Text message auto replies' },
  ];

  const { capabilities, friendly_name } = location.state?.phone || {
    capabilities: '',
    friendly_name: '',
  };
  let features: FeatureSchema[] = [
    { left: 'Phone number', right: friendly_name },
    { left: 'Shared phone numbers' },
    { left: 'Business hours' },
    { left: 'Phone menu/IVR/Extension' },
    { left: 'Saved Replies' },
  ];

  if (capabilities.includes('SMS')) {
    features = features.concat(smsFeatures);
  }

  if (capabilities.includes('voice')) {
    features = features.concat(voiceFeatures);
  }

  const makePayment = async () => {
    try {
      location.state?.phone?.phone_number &&
        (await dispatch(
          connectChannelAcct({
            channel: 'phone',
            useCaseData: location.state?.useCaseData?.companySize
              ? location.state?.useCaseData
              : undefined,
            phone_number:
              process.env.NODE_ENV === 'development'
                ? '+15005550006'
                : location.state?.phone?.phone_number,
          }),
        ));

      history.push('/s/integrations/sms-integration');
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  useEffect(() => {
    if (!location.state?.phone) {
      history.push('/s/integrations/phone');
    }
  }, [history, location.state]);

  if (!location.state?.phone) {
    return <Box />;
  }

  return (
    <Box height="100vh" paddingBottom="100px" backgroundColor="white" overflowY="auto">
      <Box p="1rem">
        <Button size="sm" variant="ghost" leftIcon="chevron-left" onClick={() => history.goBack()}>
          Back
        </Button>
      </Box>
      <Box paddingTop="3.25rem" marginX="auto" maxWidth="20.125rem" color="brandBlack">
        <Text fontSize="1.125rem" fontWeight={600}>
          Subscribe to a plan
        </Text>

        <Text fontSize=".875rem" color="rgba(46, 56, 77, 0.5)" marginTop="1rem">
          7-day trial, cancel subscription anytime.
        </Text>

        <SwitchWithText
          left="Monthly"
          right="Yearly"
          isRight={isYearly}
          setIsRight={setIsYearly}
          fontSize=".875rem"
        />

        <Box
          backgroundColor="rgba(0, 0, 0, 0.03)"
          borderRadius=".3125rem"
          fontSize=".75rem"
          padding="1.25rem 1.75rem"
        >
          <Flex alignItems="flex-end">
            <Text fontSize="1.25rem" fontWeight="bold">
              {isYearly ? '$120' : '$10'}
            </Text>
            <Text color="rgba(17, 17, 17, 0.5)" marginLeft=".3125rem" marginBottom=".25rem">
              {`/${isYearly ? 'y' : 'mo'} per user`}
            </Text>
          </Flex>

          <Text color="rgba(17, 17, 17, 0.5)" marginTop=".625rem">
            Unlimited text, calls and more
          </Text>

          <Stack marginTop="1.875rem" spacing="1.125rem">
            {(toggleFeatures ? features : features.slice(0, 1)).map(({ left, right }) => (
              <Flex
                key={left}
                justifyContent="space-between"
                paddingBottom=".625rem"
                borderBottom="dashed 1px rgba(0, 0, 0, 0.08)"
              >
                <Text>{left}</Text>
                {right && (
                  <Text color="#3d50df" fontWeight={600}>
                    {right}
                  </Text>
                )}
              </Flex>
            ))}

            <Flex
              justifyContent="space-between"
              paddingBottom=".625rem"
              borderBottom="dashed 1px rgba(0, 0, 0, 0.08)"
            >
              <Text>{toggleFeatures ? 'Available on Mobile' : 'All features'}</Text>
              <Button
                color="#3d50df"
                fontSize=".75rem"
                height="initial"
                minWidth="initial"
                padding="0"
                variant="unstyled"
                onClick={() => setToggleFeatures(!toggleFeatures)}
              >
                {toggleFeatures ? 'Collapse' : 'View all'}
              </Button>
            </Flex>
          </Stack>

          <Text fontWeight="bold" fontSize="1rem" marginTop="1rem" textAlign="right">
            Due now $0.00
          </Text>
        </Box>

        <PayButton
          variantColor="blue"
          width="100%"
          marginTop="1.875rem"
          fontSize=".865rem"
          email={email || ''}
          amount={36000}
          first_name={first_name}
          last_name={last_name}
          callback={() => makePayment()}
        >
          Start your 7-day trial
        </PayButton>
      </Box>
    </Box>
  );
}
