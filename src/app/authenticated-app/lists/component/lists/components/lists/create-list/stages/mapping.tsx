import React, { useState } from 'react';
import { Box, IconButton, Input, Select } from '@chakra-ui/core';
import camelCase from 'lodash/camelCase';
import { Button } from 'app/components';
import { PropertySchema, useProperties } from '../../../../../../../tables/components';

interface Props {
  importedData: any;
  handleCreateTable: Function;
}

export const CreateListImportMapping = (props: Props) => {
  const [createLoading, setCreateLoading] = useState(false);

  const columns = props.importedData?.columns?.map(({ name }: any) => ({
    label: name,
    hidden: false,
    type: 'TEXT',
    name: camelCase(name),
  })) as PropertySchema[];

  const { properties, onPropertyUpdate, onPropertyDelete } = useProperties({
    properties: columns,
  });

  const handleCreate = async () => {
    setCreateLoading(true);
    await props.handleCreateTable(properties);
    setCreateLoading(false);
  };

  return (
    <>
      <Box className="description">
        Set the columns from your file as properties to create a new list
      </Box>

      <Box display="flex" flexDirection="column" marginY="20px" maxH="60vh" overflowY="scroll">
        {properties?.map((property: any, index: number) => (
          <Box
            key={index}
            display="flex"
            flexDirection="row"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            marginY="7.5px"
          >
            <Input
              width="45%"
              padding="5px 12.5px"
              backgroundColor="#FAFAFA"
              size="sm"
              borderRadius="5px"
              value={property.label}
              onChange={(e: any) =>
                onPropertyUpdate(
                  {
                    ...property,
                    label: e.target.value,
                    name: camelCase(e.target.value),
                  },
                  index,
                )
              }
            />
            <Select
              width="45%"
              padding="5px 10px"
              backgroundColor="#FAFAFA"
              borderRadius="5px"
              size="sm"
              value={property.type}
              onChange={(e: any) => onPropertyUpdate({ ...property, type: e.target.value }, index)}
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="PHONE NUMBER">Phone Number</option>
              <option value="EMAIL">Email</option>
              <option value="DATE">Date</option>
              <option value="URL">URL</option>
            </Select>

            <IconButton
              aria-label="delete"
              // @ts-ignore
              icon="trash"
              size="xs"
              borderRadius="10px"
              marginRight="1rem"
              isDisabled={properties?.length === 1}
              onClick={() => onPropertyDelete(index)}
            />
          </Box>
        ))}
      </Box>

      <Box mt="10px" width="fit-content">
        <Button
          variant="solid"
          variantColor="blue"
          size="sm"
          isLoading={createLoading}
          onClick={handleCreate}
        >
          Create Table
        </Button>
      </Box>
    </>
  );
};
