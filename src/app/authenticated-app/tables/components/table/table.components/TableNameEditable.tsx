import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/core';
import * as React from 'react';
import { ConfirmModal } from '../../../../../components';
import { TablePropertiesOptions } from '../../../tables.types';

function EditableControls({
  onDelete,
  onRequestEdit,
  deleteIsDisabled,
}: {
  onDelete(): void;
  onRequestEdit(): void;
  deleteIsDisabled?: boolean;
}) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        width="auto"
        height="1rem"
        minWidth="unset"
        marginLeft="1rem"
        color="lightBlack"
        padding="0 0.2rem"
        //@ts-ignore
        variant="unstyled"
        _hover={{ color: 'black' }}
      >
        <Icon name="more" size="0.8rem" />
      </MenuButton>
      <MenuList minWidth="8rem" placement="bottom-start">
        <MenuItem
          _hover={{
            color: '#3d50df',
            backgroundColor: 'rgba(61, 80, 223, 0.06)',
          }}
          _focus={{
            color: '#3d50df',
            backgroundColor: 'rgba(61, 80, 223, 0.06)',
          }}
          _active={{
            color: '#3d50df',
            backgroundColor: 'rgba(61, 80, 223, 0.06)',
          }}
          fontSize="0.875rem"
          onClick={onRequestEdit}
        >
          Edit
        </MenuItem>
        {!deleteIsDisabled && (
          <MenuItem
            _hover={{
              color: '#3d50df',
              backgroundColor: 'rgba(61, 80, 223, 0.06)',
            }}
            _focus={{
              color: '#3d50df',
              backgroundColor: 'rgba(61, 80, 223, 0.06)',
            }}
            _active={{
              color: '#3d50df',
              backgroundColor: 'rgba(61, 80, 223, 0.06)',
            }}
            onClick={onDelete}
            fontSize="0.875rem"
          >
            Delete
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

type TableNameEditableProps = {
  isLoading?: boolean;
  onChange?: (val: string) => void;
  tables: TablePropertiesOptions[];
  sheet: { name?: string; id?: string; type?: string | null };
  onDelete?: (payload: { id: string | undefined; callback: () => void }) => void;
};

export function TableNameEditable({
  sheet,
  tables,
  onChange,
  onDelete,
  isLoading,
}: TableNameEditableProps) {
  const [input, setInput] = React.useState<string | undefined>(sheet.name || '');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteIsDisabled = sheet?.type === 'contact' && sheet.id === tables[0].id;

  React.useEffect(() => {
    setInput(sheet?.name);
  }, [sheet]);

  function handleChange(value: string) {
    setInput(value);
  }

  function handleSubmit() {
    if (input && onChange) {
      onChange(input);
    }
  }

  function handleDelete() {
    if (sheet.id) {
      onDelete && onDelete({ id: sheet.id, callback: onClose });
    }
  }

  return (
    <>
      <Flex alignItems="center">
        <Editable
          value={input}
          defaultValue={input}
          onSubmit={handleSubmit}
          onChange={handleChange}
          isPreviewFocusable={false}
        >
          {(props: any) => (
            <Flex alignItems="center">
              <EditablePreview fontWeight={700} />
              <EditableInput />
              <EditableControls onDelete={onOpen} deleteIsDisabled={deleteIsDisabled} {...props} />
            </Flex>
          )}
        </Editable>
      </Flex>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete sheet"
        isLoading={isLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}
