import React, { useEffect, useState } from 'react';
import { Box, Icon, SimpleGrid, useToast } from '@chakra-ui/core/dist';
import { Button } from 'app/components';
import { useSelector } from 'react-redux';
import { ListImportType } from '../../../../../../lists.types';
import { selectListResources } from '../../../../../../lists.selectors';
import { resource_types } from '../../../../../../list.data';
import { useHistory } from 'react-router-dom';
import { EmptyState, ToastBox } from '../../../../../../../../components';
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
      {props.selected && <Icon name="check-circle" color="#3d43df" size="20px" />}
    </Box>
  );
};

interface Props {
  fetchSources: Function;
  setSources: Function;
  setStage: Function;
  selectedResource: string | null;
  setSelectedResource: Function;
  importType: ListImportType | null;
  fetchResourceSchema: Function;
  fetchGSheetSpreadSheets: Function;
  fetchAppEndpoints: Function;
}

export const SelectListResource = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const { selectedResource, setSelectedResource } = props;

  const resources: any[] = useSelector(selectListResources);
  const resourceType = resource_types.find((i: any) => props.importType === i.key);

  const routerHistory = useHistory();
  const filteredResources = resources.filter((i: any) => i.provider === resourceType?.key);

  useEffect(() => {
    if (filteredResources.length > 0 && !selectedResource) {
      setSelectedResource(filteredResources[0].id);
    } else if (
      filteredResources.length > 0 &&
      !filteredResources.find((i: any) => i.id === selectedResource)
    ) {
      setSelectedResource(filteredResources[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toast = useToast();

  const fetchSheets = async () => {
    setLoading(true);
    try {
      const sheets: any[] = await props.fetchGSheetSpreadSheets(selectedResource);
      props.setSources(sheets);
      props.setStage('select-source');
      return;
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message="Unable to fetch connection data, please try again" />,
      });
    }
    setLoading(false);
  };

  const fetchSchema = async () => {
    setLoading(true);
    try {
      const schema: any[] = await props.fetchResourceSchema(selectedResource);
      props.setSources(schema);
      props.setStage('select-source');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message="Unable to fetch connection data, please try again" />,
      });
    }
    setLoading(false);
  };

  const fetchAppEndpoints = async (type: string | null) => {
    setLoading(true);
    try {
      const endpoints = await props.fetchAppEndpoints(type);
      props.setSources(endpoints);
      props.setStage('select-source');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message="Unable to fetch connection data, please try again" />,
      });
    }
    setLoading(false);
  };

  const proceed = async () => {
    if (!resourceType) return;
    if (resourceType.key === 'google-sheets') return await fetchSheets();
    if (['shopify', 'woo-commerce', 'mambu'].includes(resourceType.key || '')) {
      await fetchAppEndpoints(resourceType.key);
    } else await fetchSchema();
  };

  return (
    <>
      {filteredResources.length === 0 && (
        <EmptyState
          image={noResources}
          paddingY="20px"
          heading="Oops, no connections here"
          subheading="Setup a connection to enable easier and faster imports and data synchronization between data sources"
          subheadingProps={{
            width: '400px',
          }}
          children={
            <Button
              variant="outline"
              variantColor="blue"
              size="sm"
              onClick={() => routerHistory.push('/s/lists/connections')}
            >
              Add resource
            </Button>
          }
        />
      )}

      {filteredResources.length > 0 && (
        <>
          <Box className="description">
            Select the {resourceType?.label} connection which you would like to import data from
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
