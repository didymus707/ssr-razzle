import { Box, Radio, RadioGroup, Stack, Text } from '@chakra-ui/core';
import { Button } from 'app/components';
import React from 'react';

type FormValue = {
  smsNotifications?: string;
  emailNotifications?: string;
};

export type NotificationsFormProps = {
  isLoading?: boolean;
  initialValues?: FormValue;
  onSubmit?: (values: FormValue) => void;
};

export function NotificationsForm({ onSubmit, initialValues, isLoading }: NotificationsFormProps) {
  const notificationOptions = [
    { label: 'All notifications', value: 'all' },
    { label: 'Smart notifications', value: 'smart' },
    { label: 'No notifications', value: 'no' },
  ];
  const [smsNotifications, setSmsNotifications] = React.useState(
    initialValues?.smsNotifications || '',
  );
  const [emailNotifications, setEmailNotifications] = React.useState(
    initialValues?.emailNotifications || '',
  );

  const handleSubmit = () => {
    onSubmit && onSubmit({ emailNotifications, smsNotifications });
  };

  return (
    <>
      <Box marginBottom="1.5rem">
        <Text fontSize="1rem" color="#333333" marginBottom="1.5rem" fontWeight="semibold">
          Email notifications
        </Text>
        <RadioGroup
          value={emailNotifications}
          onChange={e => setEmailNotifications(e.target.value)}
        >
          {notificationOptions.map((item, index) => (
            <Radio key={index} value={item.value} variantColor="blue">
              {item.label}
            </Radio>
          ))}
        </RadioGroup>
      </Box>
      <Box marginBottom="1.5rem">
        <Text fontSize="1rem" color="#333333" marginBottom="1.5rem" fontWeight="semibold">
          SMS/mobile notifications
        </Text>
        <RadioGroup value={smsNotifications} onChange={e => setSmsNotifications(e.target.value)}>
          {notificationOptions.map((item, index) => (
            <Radio variantColor="blue" key={index} value={item.value}>
              {item.label}
            </Radio>
          ))}
        </RadioGroup>
      </Box>
      <Stack isInline alignItems="center" marginBottom="4rem">
        <Button size="sm" variantColor="blue" isLoading={isLoading} onSubmit={handleSubmit}>
          Save Details
        </Button>
      </Stack>
    </>
  );
}
