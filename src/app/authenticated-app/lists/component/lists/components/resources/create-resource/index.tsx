import React, { useState } from 'react';
import { Box, IconButton } from '@chakra-ui/core';
import { SelectResourceType, ConfigureResourceType } from './stages';
import { useHistory } from 'react-router';

interface Props {
  requestResourceAuth: Function;
  testResourceConnection: Function;
  createResource: Function;
  requestAppResourceAuth: Function;
  submitAppResourceAuth: Function;
}

export const CreateResource = (props: Props) => {
  const [stage, setStage] = useState<'select' | 'configure'>('select');
  const [resourceType, setResourceType] = useState<string | null>(null);

  const handleSelectType = (_type: string) => {
    setResourceType(_type);
    setStage('configure');
  };

  const routerHistory = useHistory();

  const goBack = () => {
    if (stage === 'select') routerHistory.push('/s/lists/connections');
    else setStage('select');
  };

  return (
    <Box className="content">
      <Box className="section-title">
        <Box className="title">
          <IconButton
            icon="arrow-back"
            size="xs"
            borderRadius="10px"
            aria-label="back"
            mr="10px"
            mb="5px"
            onClick={goBack}
          />
          {stage === 'select' ? 'Select your connection type' : 'Configure your connection'}
        </Box>
      </Box>
      {stage === 'select' && <SelectResourceType selectType={handleSelectType} />}
      {stage === 'configure' && !!resourceType && (
        <ConfigureResourceType
          createResource={props.createResource}
          resourceType={resourceType}
          requestAppResourceAuth={props.requestAppResourceAuth}
          requestResourceAuth={props.requestResourceAuth}
          submitAppResourceAuth={props.submitAppResourceAuth}
          testResourceConnection={props.testResourceConnection}
        />
      )}
    </Box>
  );
};
