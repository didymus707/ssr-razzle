import React from 'react';
import { Box, Divider, Icon, SimpleGrid } from '@chakra-ui/core/dist';
import { resource_types } from '../../../../../../list.data';
import { ResourceType } from '../../../../../../lists.types';

interface ItemProps {
  handleClick: () => void;
}

const ResourceTypeItem = (props: ResourceType & ItemProps) => {
  return (
    <Box className={`item ${props.disabled && 'disabled'}`} onClick={props.handleClick}>
      <Icon size="18px" name={props.icon || 'copy'} mr="10px" />
      {props.label}
      {props.disabled && <Box className="coming-soon">coming soon</Box>}
    </Box>
  );
};

interface Props {
  selectType: Function;
}

export const SelectResourceType = (props: Props) => {
  return (
    <Box>
      <Box className="section-type">
        <Box className="section-heading">
          Databases
          <Divider marginLeft="20px" width="100%" />
        </Box>

        <Box className="section-grid">
          <SimpleGrid spacing="20px" minChildWidth={220}>
            {resource_types
              .filter((i: ResourceType) => i.type === 'database')
              .map((i: ResourceType) => (
                <ResourceTypeItem
                  {...i}
                  handleClick={() => {
                    if (!i.disabled) {
                      props.selectType(i.key);
                    }
                  }}
                />
              ))}
          </SimpleGrid>
        </Box>
      </Box>

      <Box className="section-type">
        <Box className="section-heading">
          APIs
          <Divider marginLeft="20px" width="100%" />
        </Box>

        <Box className="section-grid">
          <SimpleGrid spacing="20px" minChildWidth={220}>
            {resource_types
              .filter((i: ResourceType) => ['api', 'app'].includes(i.type))
              .map((i: ResourceType) => (
                <ResourceTypeItem
                  {...i}
                  handleClick={() => {
                    if (!i.disabled) {
                      props.selectType(i.key);
                    }
                  }}
                />
              ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};
