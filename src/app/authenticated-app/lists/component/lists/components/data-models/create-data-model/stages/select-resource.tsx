import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectListResources } from '../../../../../../lists.selectors';
import { Box, Icon, SimpleGrid } from '@chakra-ui/core/dist';
import { useHistory } from 'react-router-dom';
import { Button, EmptyState } from 'app/components';
import noResources from '../../../../../../assets/no-resources.svg';
import { getListResourceIcon } from '../../../../../../lists.utils';

interface ItemProps {
  id: string;
  name: string;
  type?: string;
  selected?: boolean;
  provider: string;
  created_datetime?: string;
  onClick: () => void;
}

const ResourceItem = (props: ItemProps) => {
  return (
    <Box className="list-item--list" onClick={props.onClick}>
      <Box display="flex" alignItems="center">
        <Icon className="box" name={getListResourceIcon(props.provider)} size="22px" />
        <Box className="label">
          <Box
            overflow="hidden"
            // @ts-ignore
            textOverflow="ellipsis"
            maxWidth="260px"
            fontWeight="500"
          >
            {props.name}
          </Box>
        </Box>
      </Box>
      {props.selected && <Icon name="check-circle" color="#9c9c9c" size="20px" />}
    </Box>
  );
};

interface Props {
  selectedResource: string | null;
  setSelectedResource: Function;
  fetchResourceSchema: Function;
}

export const SelectResource = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const resources: any[] = useSelector(selectListResources);
  const routerHistory = useHistory();

  const filteredResources = resources.filter((i: any) => i.type === 'database');

  const { selectedResource, setSelectedResource } = props;

  useEffect(() => {
    if (filteredResources.length > 0 && !selectedResource) {
      setSelectedResource(filteredResources[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSheets = async () => {};
  const fetchSchema = async () => {
    setLoading(true);
    try {
      return await props.fetchResourceSchema(selectedResource);
    } catch (e) {}
    setLoading(false);
  };

  const proceed = () => {
    const resource = resources.find((i: any) => i.id === selectedResource);
    if (resource?.provider === 'google-sheets') fetchSheets();
    else fetchSchema();
  };

  return (
    <>
      {filteredResources.length === 0 && (
        <EmptyState
          image={noResources}
          paddingY="15vh"
          heading="Oops, no database connections here"
          subheading="Setup a database connection to be able to create data models from different sources"
          subheadingProps={{
            width: '400px',
          }}
          children={
            <Button
              variant="outline"
              variantColor="blue"
              size="sm"
              onClick={() => routerHistory.push('/s/lists/connections/new')}
            >
              Add data source
            </Button>
          }
        />
      )}

      {filteredResources.length > 0 && (
        <>
          <Box className="description">
            Select the connection which you would like to create a data model from
          </Box>

          <SimpleGrid columns={2} spacing="10px" marginY="25px">
            {filteredResources.map((i: any) => (
              <ResourceItem
                key={i.id}
                id={i.id}
                name={i.name}
                {...i}
                onClick={() => setSelectedResource(i.id)}
                selected={selectedResource === i.id}
              />
            ))}
          </SimpleGrid>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variantColor="blue"
              variant="solid"
              onClick={proceed}
              isLoading={loading}
              size="sm"
            >
              Proceed
            </Button>
          </Box>
        </>
      )}
    </>
  );
};
