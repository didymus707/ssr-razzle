import { Icon, ModalBody, PseudoBox, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { Button, ModalContainer, ModalContainerOptions } from '../../../../../components';
import { PROPERTIES_ICONS, PropertyDropdown, PropertySchema } from '../../property';
import { EditableCell } from './EditableCell';

export type RowDetailsModalProps = {
  initialValues?: any;
  onRowUpdate: () => void;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
  onAddProperty: (value?: PropertySchema) => void;
};

export const RowDetailsModal = ({
  isOpen,
  onClose,
  onRowUpdate,
  initialValues,
  onAddProperty,
}: RowDetailsModalProps) => {
  const [values, setValues] = React.useState(initialValues);
  const { id, rowIndex, ...rest } = values;
  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  return (
    <ModalContainer size="2xl" isOpen={isOpen} title="Edit row" showCloseButton onClose={onClose}>
      <ModalBody paddingBottom="2rem">
        <Stack paddingBottom="1rem">
          {Object.keys(rest).map((item, i) => {
            const { type, label, name } = rest[item];
            return (
              <Stack
                key={i}
                isInline
                flexWrap="wrap"
                alignItems="center"
                height={['auto', '40px', '40px', '40px']}
              >
                <Stack
                  isInline
                  width="160px"
                  height="100%"
                  overflow="hidden"
                  alignItems="center"
                  fontSize="0.875rem"
                  whiteSpace="nowrap"
                  color="rgba(55, 53, 47, 0.6)"
                  style={{ textOverflow: 'ellipsis' }}
                >
                  <Icon name={PROPERTIES_ICONS[type.toLowerCase()]} />
                  <Text>{label}</Text>
                </Stack>
                <PseudoBox
                  flex={1}
                  height="100%"
                  borderRadius="5px"
                  fontSize="0.875rem"
                  _hover={{ backgroundColor: 'gray.50' }}
                >
                  <EditableCell
                    column={{ id: name }}
                    row={{ index: rowIndex }}
                    value={initialValues[item]}
                    updateTableData={onRowUpdate}
                  />
                </PseudoBox>
              </Stack>
            );
          })}
        </Stack>
        <PropertyDropdown placement="bottom-start" onChange={property => onAddProperty(property)}>
          <Button size="xs" variant="ghost" variantColor="blue">
            Add New Property
          </Button>
        </PropertyDropdown>
      </ModalBody>
    </ModalContainer>
  );
};
