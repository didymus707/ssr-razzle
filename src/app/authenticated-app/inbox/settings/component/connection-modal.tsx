import {
  Box,
  Icon,
  ModalBody,
  ModalCloseButton,
  PseudoBox,
  Stack,
  useToast,
} from '@chakra-ui/core';
import { getUserChannels } from 'app/authenticated-app/channels';
import {
  selectDataModels,
  selectLists,
  selectListsById,
} from 'app/authenticated-app/lists/lists.selectors';
import { selectContactListID } from 'app/authenticated-app/lists/lists.slice';
import {
  BodyText,
  Button,
  Menu,
  MenuItem,
  ModalContainer,
  ModalContainerOptions,
  SmallText,
  ToastBox,
  XSmallText,
} from 'app/components';
import { AxiosError } from 'axios';
import { icons } from 'feather-icons';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { channelOptions } from '../..';
import { InboxSearch } from '../../components';
import { createInboxConnection } from '../../inbox.service';
import { Channel, InboxConnection } from '../../inbox.types';

export type ConnectionModalProps = ModalContainerOptions & {
  connections: InboxConnection[];
};

export const ConnectionModal = (props: ConnectionModalProps) => {
  const { isOpen, onClose, connections } = props;

  const toast = useToast();
  const queryClient = useQueryClient();
  const lists = useSelector(selectLists);
  const segments = useSelector(selectDataModels);
  const lists_by_id = useSelector(selectListsById);
  const contactListId = useSelector(selectContactListID);

  const [step, setStep] = useState(1);
  const [resources, setResources] = useState<any[]>([]);
  const [payload, setPayload] = useState<{
    filters: any[];
    type: ConnectionType;
    table_id?: string | null;
    data_model_id?: string | null;
  }>({
    filters: [],
    type: 'list',
    table_id: null,
    data_model_id: null,
  });

  const listArray = lists_by_id
    //@ts-ignore
    .map((id: string) => lists[id]);

  useEffect(() => {
    if (payload.type === 'list') {
      setResources(listArray);
    } else {
      setResources(segments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.type]);

  const { data: channels } = useQuery('channels', getUserChannels);
  const { mutate: createConnection, isLoading: isCreatingConnection } = useMutation<
    any,
    AxiosError,
    any,
    any
  >(payload => createInboxConnection(payload), {
    onMutate: async newConnection => {
      await queryClient.cancelQueries('inbox-connections');

      const previousConnections = queryClient.getQueryData('inbox-connections');

      //@ts-ignore
      queryClient.setQueryData('inbox-connections', old => [...old, newConnection]);

      return { previousConnections };
    },
    onError: (err, newConnection, context) => {
      queryClient.setQueryData('inbox-connections', context.previousConnections);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('inbox-connections');
      handleClose();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Connection created successfully" />
        ),
      });
    },
  });
  const uniqChannels = new Set(channels?.map((item: any) => item.user.channel_name));
  //@ts-ignore
  const userChannels: Channel[] = [...uniqChannels];
  const channelsWithId: any = {};

  channels?.forEach(({ uuid, user }: { uuid: string; user: any }) => {
    if (Object.keys(channelsWithId).includes(user.channel_name)) {
      channelsWithId[user.channel_name].push(uuid);
      return;
    }
    channelsWithId[user.channel_name] = [uuid];
  });

  const stepTitle: { [key: number]: { title: string; subtitle: string } } = {
    1: {
      title: 'What would you like to connect?',
      subtitle: 'Would you like to connect a list or a data model.',
    },
    2: {
      title: 'Select your list',
      subtitle: 'Choose the list you want to connect to inbox.',
    },
    3: {
      title: 'Select your unique identifier',
      subtitle: 'Choose the list you want to connect to inbox.',
    },
  };

  const handleClose = () => {
    onClose?.();
    setStep(1);
    setPayload({
      filters: [],
      type: 'list',
      data_model_id: null,
      table_id: contactListId ?? null,
    });
  };

  const handleGoBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (data: {
    filters?: any[];
    table_id?: string;
    data_model_id?: string;
    type?: ConnectionType;
  }) => {
    if (step === 3) {
      const { table_id, data_model_id, filters } = { ...payload, ...data };
      createConnection({ table_id, data_model_id, variables: { filters } });
    } else {
      setPayload({ ...payload, ...data });
      setStep(step + 1);
    }
  };

  return (
    <ModalContainer
      size="sm"
      isOpen={isOpen}
      closeOnEsc={false}
      onClose={handleClose}
      closeOnOverlayClick={false}
      title={stepTitle[step].title}
      titleStyleProps={{ px: '1rem' }}
    >
      <ModalCloseButton size="sm" />
      <ModalBody px="1rem" pt="0" pb="1.5rem">
        <SmallText color="gray.500">{stepTitle[step].subtitle}</SmallText>
        <>
          {step === 1 && (
            <StepOne type={payload.type} connections={connections} onNext={handleSubmit} />
          )}
          {step === 2 && (
            <StepTwo
              type={payload.type}
              onNext={handleSubmit}
              resources={resources}
              onBack={handleGoBack}
              resource={payload.table_id ?? payload.data_model_id}
            />
          )}
          {step === 3 && (
            <StepThree
              onBack={handleGoBack}
              resources={resources}
              onNext={handleSubmit}
              channels={userChannels}
              filters={payload.filters}
              isLoading={isCreatingConnection}
              resourceId={payload.table_id ?? payload.data_model_id}
            />
          )}
        </>
      </ModalBody>
    </ModalContainer>
  );
};

type ConnectionType = 'list' | 'segment';

const StepOne = (props: {
  type: ConnectionType;
  connections?: ConnectionModalProps['connections'];
  onNext(payload: { type: ConnectionType }): void;
}) => {
  const { type, onNext, connections } = props;
  const [selectedType, setSelectedType] = useState<ConnectionType>(type ?? 'list');

  const hasListConnection = !!connections?.find(item => !!item.table_id);
  const hasDataModelConnection = !!connections?.find(item => !!item.data_model_id);

  return (
    <>
      <Stack py="0.5rem" spacing="0.2rem">
        {!hasListConnection && (
          <PseudoBox
            as="button"
            rounded="12px"
            p="1rem 0.5rem"
            _hover={{ bg: 'blue.100' }}
            onClick={() => setSelectedType('list')}
            bg={selectedType === 'list' ? 'blue.100' : 'transparent'}
            color={selectedType === 'list' ? 'blue.500' : 'gray.900'}
          >
            <Stack isInline alignItems="center">
              <Icon name="grid2" size="1.7rem" />
              <BodyText fontWeight="bold">List</BodyText>
            </Stack>
          </PseudoBox>
        )}
        {!hasDataModelConnection && (
          <PseudoBox
            as="button"
            rounded="12px"
            p="1rem 0.5rem"
            _hover={{ bg: 'blue.100' }}
            onClick={() => setSelectedType('segment')}
            bg={selectedType === 'segment' ? 'blue.100' : 'transparent'}
            color={selectedType === 'segment' ? 'blue.500' : 'gray.900'}
          >
            <Stack isInline alignItems="center">
              <Icon name="segment-2" size="2rem" />
              <BodyText fontWeight="bold">Data model</BodyText>
            </Stack>
          </PseudoBox>
        )}
      </Stack>
      <Button isFullWidth variantColor="blue" onClick={() => onNext({ type: selectedType })}>
        Next
      </Button>
    </>
  );
};

const StepTwo = (props: {
  onBack(): void;
  resources: any[];
  type: ConnectionType;
  resource?: string | null;
  onNext(payload: { data_model_id?: string; table_id?: string }): void;
}) => {
  const { type, resource, resources: resourcesProps, onNext, onBack } = props;

  const [resources, setResources] = useState(resourcesProps);
  const [selectedResource, setSelectedResource] = useState(resource ?? '');

  const handleChange = (value: string) => {
    if (value) {
      setResources(
        resources.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase())),
      );
    } else {
      setResources(resourcesProps);
    }
  };

  useEffect(() => {
    setResources(resourcesProps);
  }, [resourcesProps]);

  return (
    <>
      <Box pt="0.5rem">
        <InboxSearch showButton={false} onSearch={handleChange} />
      </Box>
      <Stack py="0.5rem" spacing="0.2rem" height="200px" overflow="auto">
        {resources.map(resource => (
          <PseudoBox
            as="button"
            rounded="12px"
            p="1rem 0.5rem"
            key={resource.id}
            _hover={{ bg: 'blue.100' }}
            onClick={() => setSelectedResource(resource.id)}
            bg={selectedResource === resource.id ? 'blue.100' : 'transparent'}
            color={selectedResource === resource.id ? 'blue.500' : 'gray.900'}
          >
            <Stack isInline alignItems="center">
              {resource.icon ? (
                <Box
                  width="40px"
                  height="40px"
                  display="flex"
                  rounded="12px"
                  className="box"
                  alignItems="center"
                  bg={resource.color}
                  justifyContent="center"
                >
                  <img
                    alt="list-icon"
                    style={{ height: '20px' }}
                    src={`data:image/svg+xml;utf8,${icons[resource.icon].toSvg({
                      color: 'white',
                    })}`}
                  />
                </Box>
              ) : (
                <Icon name="segment-2" size="1.7rem" />
              )}
              <BodyText fontWeight="bold">{resource.name}</BodyText>
            </Stack>
          </PseudoBox>
        ))}
      </Stack>
      <Stack isInline width="100%">
        <Button width="48%" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          width="48%"
          isFullWidth
          variantColor="blue"
          isDisabled={!selectedResource}
          onClick={() => {
            let data_model_id, table_id;
            if (type === 'list') table_id = selectedResource;
            if (type === 'segment') data_model_id = selectedResource;
            onNext({ data_model_id, table_id });
          }}
        >
          Next
        </Button>
      </Stack>
    </>
  );
};

const StepThree = (props: {
  onBack(): void;
  filters: any[];
  resources: any[];
  channels: Channel[];
  isLoading?: boolean;
  segmentId?: string | null;
  resourceId?: string | null;
  onNext(payload: { filters: any }): void;
}) => {
  const {
    onNext,
    onBack,
    channels,
    resources,
    isLoading,
    resourceId,
    filters: filtersProp,
  } = props;

  const [filters, setFilters] = useState<any[]>(filtersProp ?? []);

  const selectedResourceData = resources.find(item => item.id === resourceId);

  const handleFilterChange = (filterData?: any, channel?: Channel) => {
    let newFilters = filters;
    const isChannelAdded = !!filters.find(filter => filter.channel === channel);
    if (isChannelAdded) {
      newFilters = filters.map(filter => {
        if (filter.channel === channel) {
          return {
            ...filterData,
            channel,
          };
        }
        return filter;
      });
    } else {
      newFilters = [...filters, { ...filterData, channel }];
    }
    setFilters(newFilters);
  };

  const renderResourceColumns = (item: any, _?: number, channel?: Channel) => {
    const filter = {
      value: null,
      name: item.name,
      columnID: item.id,
      operator: 'contains',
      columnType: item.type,
    };

    return (
      <MenuItem key={item.id} onClick={() => handleFilterChange(filter, channel)}>
        <SmallText color="gray.900">{item.label ?? item.key}</SmallText>
      </MenuItem>
    );
  };

  return (
    <>
      <Stack py="0.5rem" spacing="0.2rem">
        {channels.map((channel: Channel, index) => {
          const options = channelOptions[channel];
          const filterColum = filters.find(filter => filter.channel === channel);

          return (
            <PseudoBox
              display="flex"
              p="1rem 0.5rem"
              key={index.toString()}
              justifyContent="space-between"
            >
              <Stack isInline alignItems="center">
                <Icon name={options.icon} size="1.7rem" />
                <BodyText fontWeight="bold">{options.children}</BodyText>
              </Stack>
              <Stack isInline alignItems="center">
                {!!filterColum && (
                  <Box
                    w="160px"
                    rounded="4px"
                    p="0.3rem 1rem"
                    borderWidth="1px"
                    borderColor="gray.300"
                    textTransform="capitalize"
                  >
                    <XSmallText color="gray.900">{filterColum.name}</XSmallText>
                  </Box>
                )}
                <Menu
                  renderItem={(item, index) => renderResourceColumns(item, index, channel)}
                  options={selectedResourceData.columns}
                  menuListProps={{
                    width: '160px',
                    height: '200px',
                    overflow: 'auto',
                    placement: 'right-start',
                  }}
                  menuButtonProps={{
                    px: '0',
                    minW: 'unset',
                    children: <Icon size="1rem" color="#333333" name="chevron-down" />,
                  }}
                />
              </Stack>
            </PseudoBox>
          );
        })}
      </Stack>
      <Stack isInline width="100%">
        <Button width="48%" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          width="48%"
          isFullWidth
          variantColor="blue"
          isLoading={isLoading}
          isDisabled={isEmpty(filters)}
          onClick={() =>
            onNext({
              filters,
            })
          }
        >
          Next
        </Button>
      </Stack>
    </>
  );
};
