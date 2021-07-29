import React, { useState } from 'react';
import { Box, Icon, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { Button, EmptyState } from 'app/components';
import noResources from '../../../../../assets/no-resources.svg';
import { useSelector } from 'react-redux';
import { selectDataModels } from '../../../../../lists.selectors';
import { SimpleGrid } from '@chakra-ui/core/dist';
import { icons } from 'feather-icons';
import { DataModel } from '../../../../../lists.types';
import { DeleteDataModelDialog } from './delete-data-model-dialog';

interface ItemProps {
  name: string;
  description: string;
  onDeleteClicked: Function;
}

const DataModelItem = (props: ItemProps) => {
  return (
    <Menu closeOnSelect>
      {({ isOpen }) => (
        <>
          <MenuButton as={Box} className={`list-item--list ${isOpen && 'active'}`}>
            <Box display="flex" alignItems="center">
              <Box className="box" bg="rgba(15,15,15, 0.8)">
                <img
                  alt="list-icon"
                  src={`data:image/svg+xml;utf8,${icons['database'].toSvg({
                    color: 'white',
                  })}`}
                />
              </Box>
              <Box
                className="label"
                // @ts-ignore
                flexDirection="column !important"
                alignItems="flex-start !important"
                maxWidth="260px"
              >
                <Box
                  overflow="hidden"
                  // @ts-ignore
                  textOverflow="ellipsis"
                  maxWidth="260px"
                >
                  {props.name}
                </Box>
              </Box>
            </Box>
            <Box>
              <Box className="action-btn-bg">
                <Icon name="chevron-down" color="white" size="12px" />
              </Box>
            </Box>

            <MenuList minWidth="150px" placement="bottom-end" color="#333333" fontSize="12px">
              <MenuItem onClick={() => {}}>
                <Icon name="edit" size="14px" mr="10px" />
                Update data model
              </MenuItem>
              <MenuItem color="#E73D51" onClick={() => props.onDeleteClicked()}>
                <Icon name="trash" size="14px" mr="10px" />
                Delete data model
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
  deleteDataModel: Function;
}

export const ListDataModels = (props: Props) => {
  const [selectedDataModel, setSelectedDataModel] = useState<string | null>(null);

  const routerHistory = useHistory();
  const dataModels: DataModel[] = useSelector(selectDataModels);

  const { searchValue, deleteDataModel } = props;
  const filteredDataModels = dataModels.filter((i: DataModel) =>
    i.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  return (
    <>
      <DeleteDataModelDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        selectedDataModel={selectedDataModel}
        deleteDataModel={deleteDataModel}
      />

      <Box className="content">
        <Box className="section-title">
          {!searchValue && <Box className="title">Data Models</Box>}
          {!!searchValue && (
            <>
              {!!filteredDataModels.length ? (
                <Box className="title">Data Models found matching "{searchValue}"</Box>
              ) : (
                <Box className="title inactive">No Data Models found</Box>
              )}
            </>
          )}
          <Button
            variantColor="blue"
            size="sm"
            variant="solid"
            onClick={() => routerHistory.push('/s/lists/data-models/new')}
          >
            Create Data Model
          </Button>
        </Box>

        {dataModels.length === 0 && (
          <>
            <EmptyState
              image={noResources}
              paddingTop="15vh"
              heading="Oops, no data models here"
              subheading="Setup a data model from your resources to create segments and run campaigns from your own data sources"
              subheadingProps={{
                width: '500px',
              }}
            />
            <Box
              marginTop="25px"
              padding="10px 15px"
              borderRadius="5px"
              color="#333333"
              backgroundColor="#F7F7F7"
              textAlign="center"
              maxWidth="45vw"
              marginX="auto"
              fontSize="16px"
            >
              Before you can build a view and utilize your data, you must first connect Simpu to
              your database. Simpu supports connecting to a wide variety of databases, and data
              models can only be used with one of those supported databases.
            </Box>
          </>
        )}

        {filteredDataModels.length > 0 && (
          <SimpleGrid columns={2} spacing="5px">
            {filteredDataModels.map((i: any, index: number) => (
              <DataModelItem
                key={index}
                name={i.name}
                description={i.description}
                onDeleteClicked={() => {
                  setSelectedDataModel(i.id);
                  openDeleteDialog();
                }}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </>
  );
};
