import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { numberWithCommas } from '../../../../../../utils';
import {
  AdvancedSelect,
  ModalContainer,
  ModalContainerOptions,
  ToastBox,
  Button,
} from 'app/components';
import image from '../../assets/search-user.svg';
import { identityGraphDependentValues, identityGraphNumberFilter } from '../../campaigns.service';

export interface NewAudiencePayload {
  name: string;
  lga?: string[];
  count?: number;
  state?: string[];
  gender?: string[];
  percentage?: number;
  predicted_religion?: string[];
  predicted_ethnicity?: string[];
}

type NewAudienceModalProps = ModalContainerOptions & {
  states?: any[];
  genders?: any[];
  religions?: any[];
  isLoading?: boolean;
  ethnicGroups?: any[];
  hasAudiences?: boolean;
  onSubmit: (payload: {
    name: string;
    count: number;
    lga?: string[];
    state?: string[];
    gender?: string[];
  }) => void;
};

export const NewAudienceModal = ({
  states,
  isOpen,
  onClose,
  genders,
  onSubmit,
  isLoading,
  religions,
  ethnicGroups,
  hasAudiences,
}: NewAudienceModalProps) => {
  const [section, setSection] = React.useState(hasAudiences ? 1 : 0);
  const handleClose = () => {
    setSection(0);
    onClose?.();
  };

  return (
    <ModalContainer size="3xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
      {section === 0 && <WelcomeSection onContinue={() => setSection(1)} />}
      {section === 1 && (
        <FormSection
          states={states}
          genders={genders}
          onSubmit={onSubmit}
          religions={religions}
          isLoading={isLoading}
          onCancel={handleClose}
          ethnicGroups={ethnicGroups}
        />
      )}
    </ModalContainer>
  );
};

const WelcomeSection = ({ onContinue }: { onContinue(): void }) => {
  return (
    <Stack isInline spacing="0" width="100%">
      <Box width={['100%', '60%', '60%']}>
        <Box height="400px" position="relative">
          <Box
            p="1rem"
            height="100%"
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
          >
            <Box mb="1rem" px="1rem" bg="#80d086" color="white" rounded="100px" fontSize="0.875rem">
              Beta
            </Box>
            <Heading fontSize="1.4rem" mb="0.2rem" textAlign="center">
              Welcome to new audiences{' '}
              <span role="img" aria-label="hand wave">
                👋🏾
              </span>
            </Heading>
            <Text pb="4rem" fontSize="0.875rem" textAlign="center">
              New audience is a way to reach new people who are likely to be interested in your
              business because they're similar to your best existing customers.
            </Text>
          </Box>
          <Flex
            p="1rem"
            bottom="0"
            width="100%"
            position="absolute"
            borderTopWidth="1px"
            justifyContent="center"
          >
            <Button size="sm" variantColor="blue" onClick={onContinue}>
              Continue
            </Button>
          </Flex>
        </Box>
      </Box>
      <Box
        width="40%"
        bgSize="120%"
        bgPos="center"
        roundedTopRight="5px"
        roundedBottomRight="5px"
        bgImage={`url(${image})`}
        backgroundRepeat="no-repeat"
        display={['none', 'block', 'block']}
      />
    </Stack>
  );
};

type FormSectionProps = {
  onCancel(): void;
  isLoading?: boolean;
  onSubmit: (payload: {
    name: string;
    count: number;
    lga?: string[];
    state?: string[];
    gender?: string[];
    predicted_religion?: string[];
    predicted_ethnicity?: string[];
  }) => void;
  states: NewAudienceModalProps['states'];
  genders: NewAudienceModalProps['genders'];
  religions: NewAudienceModalProps['religions'];
  ethnicGroups: NewAudienceModalProps['ethnicGroups'];
};

const FormSection = ({
  states,
  genders,
  religions,
  ethnicGroups,
  onSubmit,
  onCancel,
  isLoading,
}: FormSectionProps) => {
  const toast = useToast();
  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = useFormik<{
    name: string;
    count: number;
    lga?: string[];
    state?: string[];
    gender?: string[];
    percentage?: number;
    predicted_religion?: string[];
    predicted_ethnicity?: string[];
  }>({
    onSubmit: values => {
      const { state, lga, gender, count, name, predicted_religion, predicted_ethnicity } = values;
      onSubmit({
        name,
        count: Math.ceil(count),
        lga: lga ? lga : undefined,
        state: state ? state : undefined,
        gender: gender ? gender : undefined,
        predicted_religion: predicted_religion ? predicted_religion : undefined,
        predicted_ethnicity: predicted_ethnicity ? predicted_ethnicity : undefined,
      });
    },
    initialValues: {
      name: '',
      percentage: 100,
      state: undefined,
      lga: undefined,
      gender: undefined,
      count: 0,
      predicted_religion: undefined,
      predicted_ethnicity: undefined,
    },
    validationSchema: yup
      .object()
      .shape({ name: yup.string().required('Audience name is required') }),
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [areas, setAreas] = React.useState<
    {
      label: string;
      options: any;
      showBadge: boolean;
    }[]
  >([]);
  const [audienceCount, setAudienceCount] = React.useState(0);

  const handleFetchCount = async (data: Partial<NewAudiencePayload>) => {
    const { state, lga, gender, predicted_religion, predicted_ethnicity } = data;
    const requiredFields = { state, lga, gender, predicted_religion, predicted_ethnicity };

    if (Object.values(requiredFields).every(item => !item)) {
      setFieldValue('count', 0);
      setAudienceCount(0);
      return;
    }

    try {
      const audienceCount = await identityGraphNumberFilter({
        lga: lga ? lga : undefined,
        state: state ? state : undefined,
        gender: gender ? gender : undefined,
        predicted_religion: predicted_religion ? predicted_religion : undefined,
        predicted_ethnicity: predicted_ethnicity ? predicted_ethnicity : undefined,
      });
      setFieldValue('count', audienceCount);
      setAudienceCount(audienceCount);
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleFetchLgas = async (states: string[]) => {
    try {
      const data = await identityGraphDependentValues({
        attribute: 'state',
        dependent: 'lga',
        attribute_values: states,
      });
      const areas = Object.keys(data).map(item => ({
        label: item,
        showBadge: true,
        options: data[item].map((item: string) => ({ label: item, value: item })),
      }));
      setAreas(areas);
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Stack isInline spacing="0" width="100%">
      <Box width={['100%', '60%', '60%']}>
        <Box height="100%" position="relative">
          <Box p="1rem">
            <Heading fontSize="1.4rem" mb="1rem">
              Create a new audience
            </Heading>
            <Box pb="3rem">
              <form>
                <FormControl mb="1rem" isInvalid={!!touched.name && !!errors.name}>
                  <FormLabel fontSize="0.875rem" marginBottom="0.2rem">
                    Audience name
                  </FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    name="name"
                    ref={inputRef}
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Give your audience a name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl mb="1rem" isInvalid={!!touched.state && !!errors.state}>
                  <FormLabel fontSize="0.85rem">
                    <Stack isInline alignItems="center">
                      <Text>State</Text>
                      <Tooltip
                        zIndex={10000}
                        placement="right"
                        aria-label="State"
                        label="Select a state"
                      >
                        <Icon size="0.75rem" name="info" color="gray.500" />
                      </Tooltip>
                    </Stack>
                  </FormLabel>
                  <AdvancedSelect
                    isMulti
                    size="sm"
                    isSearchable
                    isClearable={false}
                    placeholder="Search & Select a state"
                    isInvalid={!!touched.state && !!errors.state}
                    onChange={data => {
                      const state = data?.map((item: any) => item.value);
                      state && state.length && handleFetchLgas(state);
                      setFieldValue('state', state);
                      setFieldValue('lga', '');
                      setFieldValue('percentage', 100);
                      handleFetchCount({
                        ...values,
                        state: !!state && state.length ? state : undefined,
                      });
                    }}
                    options={states}
                  />
                  <FormErrorMessage>{errors.state}</FormErrorMessage>
                </FormControl>
                {values.state && (
                  <FormControl mb="1rem" isInvalid={!!touched.lga && !!errors.lga}>
                    <FormLabel fontSize="0.875rem" marginBottom="0.2rem">
                      <Stack isInline alignItems="center">
                        <Text>Area</Text>
                        <Tooltip
                          zIndex={10000}
                          placement="right"
                          aria-label="Area"
                          label="Select an area to be very specific"
                        >
                          <Icon size="0.75rem" name="info" color="gray.500" />
                        </Tooltip>
                      </Stack>
                    </FormLabel>
                    <AdvancedSelect
                      isMulti
                      isGroup
                      size="sm"
                      isSearchable
                      isClearable={false}
                      placeholder="Search & Select an area"
                      isInvalid={!!touched.lga && !!errors.lga}
                      onChange={data => {
                        const lga = data?.map((item: any) => item.value);
                        setFieldValue('lga', lga);
                        setFieldValue('percentage', 100);
                        handleFetchCount({ ...values, lga: !!lga && lga.length ? lga : undefined });
                      }}
                      options={areas}
                    />
                    <FormErrorMessage>{errors.lga}</FormErrorMessage>
                  </FormControl>
                )}
                <FormControl mb="1rem" isInvalid={!!touched.gender && !!errors.gender}>
                  <FormLabel fontSize="0.85rem">Gender</FormLabel>
                  <AdvancedSelect
                    isMulti
                    size="sm"
                    isSearchable
                    isClearable={false}
                    placeholder="Select gender"
                    isInvalid={!!touched.gender && !!errors.gender}
                    onChange={data => {
                      const gender = data?.map((item: any) => item.value);
                      setFieldValue('gender', gender);
                      setFieldValue('percentage', 100);
                      handleFetchCount({
                        ...values,
                        gender: !!gender && gender.length ? gender : undefined,
                      });
                    }}
                    options={genders}
                  />
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                </FormControl>
                <FormControl
                  mb="1rem"
                  isInvalid={!!touched.predicted_ethnicity && !!errors.predicted_ethnicity}
                >
                  <FormLabel fontSize="0.85rem">Ethnicity</FormLabel>
                  <AdvancedSelect
                    isMulti
                    size="sm"
                    isSearchable
                    isClearable={false}
                    placeholder="Select ethnicity"
                    isInvalid={!!touched.predicted_ethnicity && !!errors.predicted_ethnicity}
                    onChange={data => {
                      const predicted_ethnicity = data?.map((item: any) => item.value);
                      setFieldValue('predicted_ethnicity', predicted_ethnicity);
                      setFieldValue('percentage', 100);
                      handleFetchCount({
                        ...values,
                        predicted_ethnicity:
                          !!predicted_ethnicity && predicted_ethnicity.length
                            ? predicted_ethnicity
                            : undefined,
                      });
                    }}
                    options={ethnicGroups}
                  />
                  <FormErrorMessage>{errors.predicted_ethnicity}</FormErrorMessage>
                </FormControl>
                <FormControl
                  mb="1rem"
                  isInvalid={!!touched.predicted_religion && !!errors.predicted_religion}
                >
                  <FormLabel fontSize="0.85rem">Religion</FormLabel>
                  <AdvancedSelect
                    isMulti
                    size="sm"
                    isSearchable
                    isClearable={false}
                    placeholder="Select religion"
                    isInvalid={!!touched.predicted_religion && !!errors.predicted_religion}
                    onChange={data => {
                      const predicted_religion = data?.map((item: any) => item.value);
                      setFieldValue('predicted_religion', predicted_religion);
                      setFieldValue('percentage', 100);
                      handleFetchCount({
                        ...values,
                        predicted_religion:
                          !!predicted_religion && predicted_religion.length
                            ? predicted_religion
                            : undefined,
                      });
                    }}
                    options={religions}
                  />
                  <FormErrorMessage>{errors.predicted_ethnicity}</FormErrorMessage>
                </FormControl>
                {!!audienceCount && (
                  <>
                    <FormControl mb="1rem" isInvalid={!!touched.percentage && !!errors.percentage}>
                      <FormLabel fontSize="0.85rem">Target by percentage</FormLabel>
                      <Input
                        max={100}
                        step={0.1}
                        type="number"
                        value={values.percentage}
                        placeholder="Enter a percentage"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value ? parseFloat(e.target.value) : 0;
                          if (value <= 100) {
                            const count = parseFloat(
                              ((value / 100) * (audienceCount ?? 0)).toFixed(2),
                            );
                            setFieldValue('percentage', value);
                            setFieldValue('count', count);
                          }
                        }}
                      />
                      <FormErrorMessage>{errors.percentage}</FormErrorMessage>
                    </FormControl>
                    <Alert
                      mb="2.5rem"
                      status="info"
                      borderRadius="0.125rem"
                      backgroundColor="rgb(198, 246, 213)"
                    >
                      <AlertIcon size="1rem" color="rgb(56, 161, 105)" />
                      <Text fontSize="0.875rem">
                        You won't be billed for messages sent to numbers on DND.
                      </Text>
                    </Alert>
                  </>
                )}
              </form>
            </Box>
          </Box>
          <Stack
            p="1rem"
            isInline
            bottom="0"
            width="100%"
            position="absolute"
            borderTopWidth="1px"
            justifyContent="flex-end"
          >
            <Button size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              variantColor="blue"
              isLoading={isLoading}
              onClick={handleSubmit}
              isDisabled={!values.count || !audienceCount}
            >
              Create audience
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box
        p="1rem"
        width="40%"
        alignItems="center"
        roundedTopRight="5px"
        flexDirection="column"
        justifyContent="center"
        roundedBottomRight="5px"
        backgroundColor="#fbfbfb"
        display={['none', 'flex', 'flex']}
      >
        <Heading pb="0.5rem" fontSize="1rem" color="blue.500" fontWeight={500}>
          Estimated Audience
        </Heading>
        <Text color="blue.500" fontSize="3rem" fontWeight={700}>
          {numberWithCommas(Math.ceil(values.count || audienceCount))}
        </Text>
      </Box>
    </Stack>
  );
};
