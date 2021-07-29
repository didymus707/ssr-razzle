import React, { useState } from 'react';
import { Box, IconButton } from '@chakra-ui/core';
import { useHistory } from 'react-router';
import { SelectResource, MapSchema, SchemaSummary } from './stages';

interface Props {
  createDataModel: Function;
  fetchResourceSchema: Function;
  fetchResourceSubSchema: Function;
}

export const CreateDataModel = (props: Props) => {
  const [stage, setStage] = useState<
    'select-resource' | 'map-schema' | 'schema-summary' | 'success-prompt'
  >('select-resource');
  const [schema, setSchema] = useState<any[]>([]);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [addedColumns, setAddedColumns] = useState<{
    [key: string]: {
      table_name: string;
      columns: { value: string; data_type: string }[];
      relationship: any;
    };
  }>({});

  const routerHistory = useHistory();

  const handleFetchResourceSchema = async () => {
    setSchema(await props.fetchResourceSchema(selectedResource));
    setStage('map-schema');
  };

  const goBack = () => {
    if (stage === 'select-resource') routerHistory.push('/s/lists/data-models');
    if (stage === 'map-schema') setStage('select-resource');
    if (stage === 'schema-summary') setStage('map-schema');
    else setStage('select-resource');
  };

  return (
    <Box className="content">
      <Box className="section-title">
        <Box className="title">
          {stage !== 'success-prompt' && (
            <IconButton
              icon="arrow-back"
              size="xs"
              borderRadius="10px"
              aria-label="back"
              mr="10px"
              mb="5px"
              onClick={goBack}
            />
          )}
          Create Data Model
        </Box>
      </Box>
      {stage === 'select-resource' && (
        <SelectResource
          {...{
            selectedResource,
            setSelectedResource,
            fetchResourceSchema: handleFetchResourceSchema,
          }}
        />
      )}
      {stage === 'map-schema' && (
        <MapSchema
          {...{
            schema,
            goBack,
            addedColumns,
            setAddedColumns,
            proceed: () => setStage('schema-summary'),
          }}
        />
      )}
      {stage === 'schema-summary' && (
        <SchemaSummary
          {...{ addedColumns, selectedResource, createDataModel: props.createDataModel }}
        />
      )}
    </Box>
  );
};
