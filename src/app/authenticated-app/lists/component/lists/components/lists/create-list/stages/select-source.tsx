import React, { useEffect, useState } from 'react';
import { Box, Spinner, useToast } from '@chakra-ui/core';
import { Button, EmptyState, ToastBox, Select } from 'app/components';
import noResources from '../../../../../../assets/no-resources.svg';
import { resource_types } from '../../../../../../list.data';

interface Props {
  importType: string | null;
  setStage: Function;
  sources: any[];
  selectedResource: string | null;
  fetchGSheetMetadata: Function;
  sourceMeta: any[] | null;
  setSourceMeta: Function;
  selectedSheet: string | null;
  setSelectedSheet: Function;
  selectedSource: string | null;
  setSelectedSource: Function;
  fetchAppEndpointSchema: Function;
}

export const SelectListSource = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [proceedLoading, setProceedLoading] = useState<boolean>(false);

  const resourceType = resource_types.find((i: any) => props.importType === i.key);

  const {
    setStage,
    sources,
    selectedResource,
    setSelectedSource,
    selectedSource,
    selectedSheet,
    setSelectedSheet,
    sourceMeta,
    setSourceMeta,
  } = props;

  const toast = useToast();

  const handleSpreadSheetChanged = async () => {
    setLoading(true);
    setSourceMeta(null);
    setSelectedSheet(null);
    try {
      const metadata = await props.fetchGSheetMetadata(selectedResource, selectedSource);
      setSourceMeta(metadata);
      if (metadata.length > 0) {
        setSelectedSheet(metadata[0].title);
      }
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Unable to fetch information about your spreadsheet, please try again"
          />
        ),
      });
    }
    setLoading(false);
  };

  const handleTableChanged = () => {
    const sourceItem = sources.find((i: any) => i.table_name === selectedSource);
    setSourceMeta(sourceItem?.columns || []);
  };

  const handleEndpointProceed = async () => {
    setProceedLoading(true);
    try {
      const schema = await props.fetchAppEndpointSchema(resourceType?.key, selectedSource);
      setSourceMeta(schema);
      return setStage('schema-mapping');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Unable to fetch information about your connection endpoint, please try again"
          />
        ),
      });
    }
    setProceedLoading(false);
  };

  useEffect(() => {
    if (!resourceType) return;
    if (selectedSource) {
      if (resourceType?.key === 'google-sheets') {
        handleSpreadSheetChanged();
      } else if (resourceType?.type === 'database') {
        handleTableChanged();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource]);

  useEffect(() => {
    if (!selectedSource && sources.length > 0) {
      if (resourceType?.key === 'google-sheets') {
        setSelectedSource(sources[0].id);
        return;
      }
      if (resourceType?.type === 'app') {
        setSelectedSource(sources[0].id);
      } else {
        setSelectedSource(sources[0].table_name);
        setSourceMeta(sources[0].columns);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proceed = async () => {
    if (resourceType?.type === 'app') {
      await handleEndpointProceed();
    } else setStage('schema-mapping');
  };

  return (
    <>
      {sources.length === 0 && (
        <EmptyState
          image={noResources}
          paddingY="20px"
          heading={
            resourceType?.key === 'google-sheets'
              ? 'Oops, no spreadsheets on this drive'
              : 'Oops, no tables available on this database'
          }
          subheading={
            resourceType?.key === 'google-sheets'
              ? 'Select a drive connection that contains spreadsheets, so you can import your data'
              : `Select a ${resourceType?.label} connection that contains tables, so you can import your data`
          }
          subheadingProps={{
            width: '400px',
          }}
        />
      )}

      {sources.length > 0 && (
        <>
          {resourceType?.key === 'google-sheets' && (
            <>
              <Box className="description">
                Select the spreadsheet which you would like to import data from
              </Box>

              <Box display="flex" flexDirection="column" marginY="20px">
                <Box marginBottom="20px">
                  <Select
                    label="Spreadsheet"
                    value={selectedSource || ''}
                    onChange={(e: any) => setSelectedSource(e.target.value)}
                  >
                    {sources.map((i: any) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box marginBottom="10px">
                  <Box marginBottom="5px" display="flex" flexDirection="row" alignItems="center">
                    {loading && <Spinner size="xs" />}
                  </Box>
                  <Select
                    label="Sheet"
                    value={selectedSheet || ''}
                    onChange={(e: any) => setSelectedSheet(e.target.value)}
                    isDisabled={loading || sourceMeta?.length === 0}
                  >
                    <option value="">Select sheet</option>
                    {sourceMeta &&
                      sourceMeta.map((i: any) => (
                        <option key={i.title} value={i.title}>
                          {i.title}
                        </option>
                      ))}
                  </Select>

                  {!loading && sourceMeta?.length === 0 && (
                    <Box mt="20px" fontSize="12px">
                      Looks like the selected sheet is actually empty, please select another one
                    </Box>
                  )}
                </Box>
              </Box>

              <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
                <Button
                  variantColor="blue"
                  variant="solid"
                  size="sm"
                  onClick={proceed}
                  isDisabled={!selectedSheet}
                >
                  Proceed
                </Button>
              </Box>
            </>
          )}

          {resourceType?.type === 'app' && (
            <>
              <Box className="description">
                Select the endpoint which you would like to import data from
              </Box>

              <Box display="flex" flexDirection="column" marginY="20px">
                <Box marginBottom="20px">
                  <Select
                    label="Endpoint"
                    value={selectedSource || ''}
                    onChange={(e: any) => setSelectedSource(e.target.value)}
                  >
                    {sources.map((i: any) => (
                      <option key={i.id} value={i.id}>
                        {i.request_name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Box>

              <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
                <Button
                  variantColor="blue"
                  variant="solid"
                  size="sm"
                  onClick={proceed}
                  isDisabled={!selectedSource}
                  isLoading={proceedLoading}
                >
                  Proceed
                </Button>
              </Box>
            </>
          )}

          {resourceType?.type === 'database' && (
            <>
              <Box className="description">
                Select the table which you would like to import data from
              </Box>
              <Box display="flex" flexDirection="column" marginY="20px">
                <Box marginBottom="20px">
                  <Select
                    label="Table"
                    value={selectedSource || ''}
                    onChange={(e: any) => setSelectedSource(e.target.value)}
                  >
                    {sources.map((i: any) => (
                      <option key={i.table_name} value={i.table_name}>
                        {i.table_name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Box>

              <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
                <Button variantColor="blue" variant="solid" size="sm" onClick={proceed}>
                  Proceed
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
};
