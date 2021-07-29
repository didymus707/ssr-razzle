import React, { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  CloseButton,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/core';
import { Button } from 'app/components';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectListResources } from '../../../../../lists.selectors';
import { useHistory } from 'react-router';
import { DeleteResourceDialog } from '../delete-resource-dialog';
import { UpdateResourceDialog } from '../update-resource-dialog';
import { EmptyState } from '../../../../../../../components';
import noResources from '../../../../../assets/no-resources.svg';
import { getListResourceIcon } from '../../../../../lists.utils';
import { useQuery } from '../../../../../../../../hooks';
import { Resource } from '../../../../../lists.types';

interface StatusAlertProps {
  status: string | null;
  type: string;
  onClose: () => void;
}

const StatusAlert = (props: StatusAlertProps) => {
  let message: string = '';

  if (props.status === 'success') message = `${props.type} connection successful!`;
  else message = `Unable to add ${props.type} connection, please try again`;

  return (
    <Alert
      // @ts-ignore
      status={props.status}
      color="#333333"
      fontSize="14px"
      borderRadius="8px"
      paddingY="15px"
      marginBottom="25px"
    >
      <AlertIcon />
      {message}
      <CloseButton position="absolute" size="sm" right="10px" onClick={props.onClose} />
    </Alert>
  );
};

interface ItemProps {
  id: string;
  name: string;
  type?: string;
  provider: string;
  created_datetime?: string;
  active?: boolean;
  onDeleteClicked: () => void;
  onUpdateClicked: () => void;
}

const ResourceItem = (props: ItemProps) => {
  return (
    <Menu closeOnSelect>
      {({ isOpen }) => (
        <>
          <MenuButton as={Box} className={`list-item--list ${isOpen && 'active'}`}>
            <Box display="flex" alignItems="center">
              <Icon className="box" name={getListResourceIcon(props.provider)} size="20px" />
              <Box
                className="label"
                // @ts-ignore
                flexDirection="column !important"
                alignItems="flex-start !important"
              >
                <Box
                  overflow="hidden"
                  // @ts-ignore
                  textOverflow="ellipsis"
                  maxWidth="260px"
                >
                  {props.name}
                </Box>
                <Box fontSize="12px" color="#A5ABB3" display="flex">
                  <Box color="#6cce6c" mr="0.5rem">
                    [Read Only]
                  </Box>
                  {moment(props.created_datetime).format('DD/MM/YYYY')}
                </Box>
              </Box>
            </Box>
            <Box>
              <Box className="action-btn-bg">
                <Icon name="chevron-down" color="white" size="12px" />
              </Box>
            </Box>

            <MenuList minWidth="150px" placement="bottom-end" color="#333333" fontSize="12px">
              <MenuItem onClick={props.onUpdateClicked}>
                <Icon name="edit" size="14px" mr="10px" />
                Update connection
              </MenuItem>
              <MenuItem color="#E73D51" onClick={props.onDeleteClicked}>
                <Icon name="trash" size="14px" mr="10px" />
                Delete connection
              </MenuItem>
            </MenuList>
          </MenuButton>
        </>
      )}
    </Menu>
  );
};

interface Props {
  searchValue: string;
  deleteResource: Function;
  updateResource: Function;
  enableResourceWebhook: Function;
  disableResourceWebhook: Function;
}

export const ListResources = (props: Props) => {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const {
    searchValue,
    deleteResource,
    updateResource,
    enableResourceWebhook,
    disableResourceWebhook,
  } = props;

  const resources: Resource[] = useSelector(selectListResources);
  const routerHistory = useHistory();

  const query = useQuery();

  const connectStatus = query.get('connectStatus');
  const connectType = query.get('connectType');

  const filteredResources = resources.filter((i: Resource) =>
    i.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const {
    isOpen: isUpdateDialogOpen,
    onClose: closeUpdateDialog,
    onOpen: openUpdateDialog,
  } = useDisclosure();

  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  return (
    <>
      <DeleteResourceDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        selectedResource={selectedResource}
        deleteResource={deleteResource}
      />

      <UpdateResourceDialog
        isOpen={isUpdateDialogOpen}
        onClose={closeUpdateDialog}
        selectedResource={selectedResource}
        updateResource={updateResource}
        enableResourceWebhook={enableResourceWebhook}
        disableResourceWebhook={disableResourceWebhook}
      />

      <Box className="content">
        <Box className="section-title">
          {!searchValue && <Box className="title">Connections</Box>}
          {!!searchValue && (
            <>
              {!!filteredResources.length ? (
                <Box className="title">Connections found matching "{searchValue}"</Box>
              ) : (
                <Box className="title inactive">No connections found</Box>
              )}
            </>
          )}
          <Button
            variantColor="blue"
            size="sm"
            variant="solid"
            onClick={() => routerHistory.push('/s/lists/connections/new')}
          >
            Connect a data source
          </Button>
        </Box>

        {connectType && ['success', 'error'].includes(connectStatus || '') && (
          <StatusAlert
            status={connectStatus}
            type={connectType}
            onClose={() => routerHistory.push('/s/lists/connections')}
          />
        )}

        {resources.length === 0 && (
          <EmptyState
            image={noResources}
            paddingY="15vh"
            heading="Oops, no connections here"
            subheading="Setup a connection to enable easier, faster and realtime imports and data synchronization between data sources"
            subheadingProps={{
              width: '500px',
            }}
          />
        )}

        {filteredResources.length > 0 && (
          <SimpleGrid columns={2} spacing="5px">
            {filteredResources.map((i: Resource) => (
              <ResourceItem
                {...i}
                key={i.id}
                id={i.id}
                name={i.name}
                onDeleteClicked={() => {
                  setSelectedResource(i.id);
                  openDeleteDialog();
                }}
                onUpdateClicked={() => {
                  setSelectedResource(i.id);
                  openUpdateDialog();
                }}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </>
  );
};
