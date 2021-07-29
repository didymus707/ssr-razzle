import React, { useState } from 'react';
import { useHistory } from 'react-router';
import {
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/core';
import { Button, EmptyState } from 'app/components';
import { useSelector } from 'react-redux';
import { selectSegments } from '../../../../../lists.selectors';
import noResources from '../../../../../assets/no-resources.svg';
import { icons } from 'feather-icons';
import { Segment } from '../../../../../lists.types';
import { DeleteSegmentDialog } from './delete-segment-dialog';

interface ItemProps {
  name: string;
  description: string;
  onDeleteClicked: Function;
}

const SegmentItem = (props: ItemProps) => {
  return (
    <Menu closeOnSelect>
      {({ isOpen }) => (
        <>
          <MenuButton as={Box} className={`list-item--list ${isOpen && 'active'}`}>
            <Box display="flex" alignItems="center">
              <Box className="box" bg="#02AAA4">
                <img
                  alt="list-icon"
                  src={`data:image/svg+xml;utf8,${icons['pie-chart'].toSvg({
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
                Update segment
              </MenuItem>
              <MenuItem color="#E73D51" onClick={() => props.onDeleteClicked()}>
                <Icon name="trash" size="14px" mr="10px" />
                Delete segment
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
  deleteSegment: Function;
}

export const ListSegments = (props: Props) => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const routerHistory = useHistory();
  const segments: Segment[] = useSelector(selectSegments);

  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  const { searchValue, deleteSegment } = props;

  const filteredSegments = segments.filter((i: Segment) =>
    i.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <>
      <DeleteSegmentDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        selectedSegment={selectedSegment}
        deleteSegment={deleteSegment}
      />

      <Box className="content">
        <Box className="section-title">
          {!searchValue && <Box className="title">Segments</Box>}
          {!!searchValue && (
            <>
              {!!filteredSegments.length ? (
                <Box className="title">Segments found matching "{searchValue}"</Box>
              ) : (
                <Box className="title inactive">No Segments found</Box>
              )}
            </>
          )}
          <Button
            variantColor="blue"
            size="sm"
            variant="solid"
            onClick={() => routerHistory.push('/s/lists/segments/new')}
          >
            Create Segment
          </Button>
        </Box>

        {segments.length === 0 && (
          <EmptyState
            image={noResources}
            paddingY="15vh"
            heading="Oops, no segments here"
            subheading={'Setup a segment from data models to run even more powerful campaigns'}
            subheadingProps={{
              width: '500px',
            }}
          />
        )}

        {filteredSegments.length > 0 && (
          <SimpleGrid columns={2} spacing="5px">
            {filteredSegments.map((i: any, index: number) => (
              <SegmentItem
                key={index}
                name={i.name}
                description={i.description}
                onDeleteClicked={() => {
                  setSelectedSegment(i.id);
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
