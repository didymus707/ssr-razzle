import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, IconButton, Input, Select, useToast } from '@chakra-ui/core';
import { Button } from 'app/components';
import { selectListResources } from '../../../../../../lists.selectors';
import camelCase from 'lodash/camelCase';
import { PropertySchema, useProperties } from '../../../../../../../tables/components';
import { List } from '../../../../../../lists.types';
import { ToastBox } from '../../../../../../../../components';
import { resource_types } from '../../../../../../list.data';

interface Props {
  importType: string | null;
  setStage: Function;
  selectedResource: any;
  selectedSheet: any;
  selectedSource: any;
  sources: any;
  sourceMeta: any;
  setImportedList: Function;
  queueResourceImport: Function;
  queueAppImport: Function;
}

export const CreateListSchemaMapping = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const resources = useSelector(selectListResources);
  const resource = resources.find((i: any) => i.id === props.selectedResource);
  const resourceType = resource_types.find((i: any) => props.importType === i.key);
  const source = props.sources.find((i: any) => i.id === props.selectedSource);
  let meta = null;
  let columns: any[];

  if (resourceType?.key === 'google-sheets') {
    meta = props.sourceMeta.find((i: any) => i?.title === props.selectedSheet);
    columns = meta.headers.map((i: any) => ({
      label: i.label,
      name: camelCase(i.label),
      hidden: false,
      type: 'TEXT',
      column: i.index,
    })) as PropertySchema[];
  } else if (resourceType?.type === 'app') {
    columns = props.sourceMeta.map((i: any) => ({
      label: i.label,
      name: camelCase(i.label),
      hidden: false,
      type: i.type,
      column: i.key,
    })) as PropertySchema[];
  } else {
    columns = props.sourceMeta.map((i: any) => ({
      label: i.name,
      name: camelCase(i.name),
      hidden: false,
      type: 'TEXT',
      column: i.name,
    })) as PropertySchema[];
  }

  const { properties, onPropertyUpdate, onPropertyDelete } = useProperties({
    properties: columns,
  });

  const toast = useToast();

  const proceed = async () => {
    setLoading(true);
    try {
      let list: List;
      if (resourceType?.type === 'app') {
        list = await props.queueAppImport(
          {
            name: source?.request_name,
            resource: props.selectedResource,
            source: props.selectedSource,
            mapping: properties,
          },
          resourceType?.key,
        );
      } else {
        list = await props.queueResourceImport(
          {
            name: props.selectedSheet || props.selectedSource,
            resource: props.selectedResource,
            source: props.selectedSource,
            sub_source: props.selectedSheet,
            mapping: properties,
          },
          resourceType?.key,
        );
      }
      props.setImportedList(list);
      return props.setStage('success-prompt');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Unable to import list at the moment due to an error, please try again"
          />
        ),
      });
    }

    setLoading(false);
  };

  return (
    <>
      {resourceType?.key === 'google-sheets' && (
        <>
          <Box className="description">
            Set the columns from your spreadsheet as properties to create a new list
          </Box>

          <Box mt="20px" fontSize="12px" cursor="default">
            {resource.name} &gt; {source?.name || source?.table_name} &gt; {props.selectedSheet}
          </Box>
        </>
      )}

      {resourceType?.type === 'app' && (
        <>
          <Box className="description">
            Set the columns from this {resourceType.label} as properties to create a new list
          </Box>

          <Box mt="20px" fontSize="12px" cursor="default">
            {resource.name} &gt; {source?.request_name}
          </Box>
        </>
      )}

      {resourceType?.type === 'database' && (
        <>
          <Box className="description">
            Set the columns from your database table as properties to create a new list
          </Box>
          <Box mt="20px" fontSize="12px" cursor="default">
            {resource.name} &gt; {props.selectedSource}
          </Box>
        </>
      )}

      <Box
        display="flex"
        flexDirection="column"
        marginTop="10px"
        marginBottom="20px"
        maxHeight="calc(100vh - 470px)"
        overflowY="scroll"
      >
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

      <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
        <Button variantColor="blue" variant="solid" size="sm" onClick={proceed} isLoading={loading}>
          Proceed
        </Button>
      </Box>
    </>
  );
};
