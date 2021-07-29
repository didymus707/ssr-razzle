import React, { useEffect, useState } from 'react';
import { Box, Divider, IconButton, Spinner, useToast } from '@chakra-ui/core/dist';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { selectDataModels } from '../../../../../lists.selectors';
import { Button, Input, Select, Textarea, ToastBox } from 'app/components';
import { v4 as uuid } from 'uuid';
import { FilterItem } from '../../../../../components/filter/filter-item';
import { available_operators } from '../../../../../list.data';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Props {
  createSegment: Function;
  fetchDataModel: Function;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Segment name is required'),
});

export const CreateSegment = (props: Props) => {
  const [selectedDataModel, setSelectedDataModel] = useState<string | null>(null);
  const [dataModelColumns, setDataModelColumns] = useState<any[] | null>(null);
  const [dataModelLoading, setDataModelLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<any[]>([]);
  const [proceedAttempted, setProceedAttempted] = useState<boolean>(false);

  const handleCreateSegment = async (values: any) => {
    setSubmitting(true);
    const payload = {
      ...values,
      data_model: selectedDataModel,
      filters: filters.map((i: any) => {
        const filterItem = { ...i, column: i.columnID };

        const { subOperator } = filterItem;
        if (!subOperator) return filterItem;

        if (subOperator === 'today') filterItem['value'] = { diff: '0', period: 'day' };
        if (subOperator === 'tomorrow') filterItem['value'] = { diff: '+1', period: 'day' };
        if (subOperator === 'yesterday') filterItem['value'] = { diff: '-1', period: 'day' };
        if (subOperator === 'one week ago') filterItem['value'] = { diff: '-7', period: 'day' };
        if (subOperator === 'one week from now')
          filterItem['value'] = { diff: '+7', period: 'day' };
        if (subOperator === 'one month ago') filterItem['value'] = { diff: '-1', period: 'month' };
        if (subOperator === 'one month from now')
          filterItem['value'] = { diff: '+1', period: 'month' };
        if (subOperator === 'number of days from now') {
          filterItem['value'] = {
            diff: filterItem['value'] ? `+${filterItem['value']}` : '0',
            period: 'day',
          };
        }
        if (subOperator !== 'exact date') {
          filterItem['value'] = JSON.stringify(filterItem['value']);
        }

        return filterItem;
      }),
    };

    try {
      await props.createSegment(payload);
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="success" message="Segment created successfully" />,
      });
      setSubmitting(false);
      return routerHistory.push('/s/lists/segments');
    } catch (e) {
      setSubmitting(false);
      toast({
        position: 'bottom-left',
        render: () => (
          <ToastBox status="error" message="Unable to create segment, please try again" />
        ),
      });
    }
  };

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: { name: '', description: '' },
    onSubmit: handleCreateSegment,
  });

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleReset,
    isSubmitting,
    setSubmitting,
  } = formik;

  const dataModels = useSelector(selectDataModels);
  const routerHistory = useHistory();
  const toast = useToast();

  const handleDataModelChange = async (dataModelID: string) => {
    setDataModelLoading(true);
    try {
      const dataModel = await props.fetchDataModel(dataModelID);
      setDataModelColumns(dataModel.columns.map((i: any) => ({ ...i, type: i.data_type })));
    } catch (e) {
      setDataModelColumns(null);
      toast({
        position: 'bottom-left',
        render: () => (
          <ToastBox status="error" message="Unable to fetch columns, please try again" />
        ),
      });
    }
    setFilters([]);
    setDataModelLoading(false);
  };

  const addFilter = () => {
    if (!dataModelColumns || dataModelColumns.length === 0) return;
    const firstColumn = dataModelColumns[0];
    const filterUID = uuid();

    let operator = 'contains';
    let subOperator = null;

    if (firstColumn.data_type === 'DATE') {
      operator = 'dateEqual';
      subOperator = 'exact date';
    }

    if (firstColumn.data_type === 'NUMBER') {
      operator = 'equals';
    }

    const filterItem: { [key: string]: any } = {
      uid: filterUID,
      columnID: firstColumn['id'],
      operator,
      subOperator,
      value: '',
      name: firstColumn['name'],
      conjunction: null,
    };

    if (filters.length > 0) {
      filterItem['conjunction'] = 'and';
    }

    const updatedFilters = [...filters, filterItem];
    setFilters(updatedFilters);
  };
  const updateFilter = (filterIndex: number, payload: {}) => {
    const filter = filters[filterIndex];
    const updatedFilter = { ...filter, ...payload };

    if (filter.columnID !== updatedFilter.columnID) {
      const column = columns[updatedFilter.columnID];
      const allowedOperator = Object.values(available_operators).find((i: any) =>
        i.column_types.includes(column.type),
      );

      updatedFilter['operator'] = allowedOperator?.['key'];
      if (column.type === 'DATE') updatedFilter['subOperator'] = 'exact date';
      else updatedFilter['subOperator'] = null;

      updatedFilter['operator'] = allowedOperator?.['key'];
      if (column.type === 'DND') updatedFilter['value'] = true;
    }

    const updatedFilters = [...filters];
    updatedFilters[filterIndex] = updatedFilter;

    if (filter.conjunction !== updatedFilter.conjunction) {
      updatedFilters.forEach((i: any, index: number) => {
        if (index > 0) {
          updatedFilters[index]['conjunction'] = updatedFilter['conjunction'];
        }
      });
    }
    setFilters(updatedFilters);
  };
  const deleteFilter = (filterIndex: number) => {
    const updatedFilters = filters.filter((i: any, index: number) => index !== filterIndex);
    if (filterIndex === 0 && updatedFilters.length > 0) updatedFilters[0].conjunction = null;

    setFilters(updatedFilters);
  };

  useEffect(() => {
    if (selectedDataModel !== null) {
      handleDataModelChange(selectedDataModel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataModel]);

  const columns: { [key: string]: any } = {};
  const columns_by_id: string[] = [];

  if (dataModelColumns) {
    dataModelColumns.forEach((i: any) => {
      columns_by_id.push(i.id);
      columns[i.id] = { ...i, label: i.key };
    });
  }

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
            onClick={() => routerHistory.goBack()}
          />
          Create Segment
        </Box>
      </Box>

      <Box className="description">
        Select your base data model, and then specify filters to segment your data
      </Box>

      <Box mt="2rem" mb="1rem">
        <Box mb="1.5rem">
          <Input
            label="Name"
            name="name"
            placeholder="Short and unique name for this segment"
            color="#333333"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onReset={handleReset}
            errorMessage={errors.name}
            isInvalid={!!errors.name}
            autoFocus
          />
        </Box>

        <Textarea
          label="Description"
          name="description"
          placeholder="Brief description on what this segment was created for"
          mb="1.5rem"
          color="#333333"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          onReset={handleReset}
          errorMessage={errors.description}
        />
        <Select
          label="Data Model"
          width="100%"
          mb="1rem"
          color="#333333"
          isInvalid={!selectedDataModel && proceedAttempted}
          errorMessage="Segment data model is required"
          onChange={event => {
            const value = event.target.value;
            if (value !== 'null') {
              setSelectedDataModel(value);
            }
          }}
        >
          <option value="null">Select data model</option>
          {dataModels.map((i: any) => (
            <option key={i.id} value={i.id} label={i.name}>
              {i.name}
            </option>
          ))}
        </Select>
      </Box>

      {dataModelLoading && (
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="md" />
      )}

      {dataModelColumns && (
        <Box mt="1rem" mb="0.5rem">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            color="#737373"
            fontWeight="500"
            mb="1rem"
          >
            <Box mr="1rem">Filters</Box>
            <Divider width="100%" />
          </Box>

          <Box color="#333333" maxW="700px">
            {filters.map((filter: any, index: number) => (
              <FilterItem
                {...{
                  ...filter,
                  index,
                  key: index,
                  uid: index,
                  columns,
                  columns_by_id,
                  allow_conjunction_select: index !== 0,
                  updateFilter,
                  deleteFilter,
                  debounceUpdate: false,
                }}
              />
            ))}
          </Box>

          {filters.length === 0 && (
            <Box color="#333333" fontSize="14px">
              You haven't added any filters here yet
            </Box>
          )}

          <Button size="sm" variant="link" variantColor="blue" mt="1rem" onClick={addFilter}>
            Add a filter
          </Button>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" mt="1rem">
        <Button
          variantColor="blue"
          variant="solid"
          onClick={event => {
            setProceedAttempted(true);
            if (!selectedDataModel) return;
            formik.handleSubmit(event);
          }}
          isLoading={isSubmitting}
          size="sm"
        >
          Create segment
        </Button>
      </Box>
    </Box>
  );
};
