import React, { useEffect, useState } from 'react';
import { Box, Divider, Input, useToast } from '@chakra-ui/core/dist';
import { Select, Input as Input2, Button, ToastBox } from 'app/components';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router';

interface Props {
  addedColumns: {
    [key: string]: {
      table_name: string;
      columns: { value: string; data_type: string }[];
      relationship: any;
    };
  };
  selectedResource: string | null;
  createDataModel: Function;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Connection name is required'),
});

const estimateDataType = (dataType: string) => {
  if (dataType.toLowerCase().includes('var')) return 'TEXT';
  if (['int', 'float', 'decimal'].includes(dataType.toLowerCase())) return 'NUMBER';
  if (dataType.toLowerCase().includes('time')) return 'DATE';
  return 'TEXT';
};

export const SchemaSummary = (props: Props) => {
  const [columns, setColumns] = useState<any[]>([]);
  const { addedColumns, selectedResource } = props;

  const toast = useToast();
  const routerHistory = useHistory();

  const proceed = async (values: any) => {
    setSubmitting(true);
    const relationships: any = [];

    Object.values(addedColumns).forEach((i: any) => {
      if (i.relationship) {
        relationships.push(i.relationship);
      }
    });
    const payload = {
      ...values,
      resource: selectedResource,
      columns,
      relationships,
    };

    try {
      await props.createDataModel(payload);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Data model created successfully" />
        ),
      });

      routerHistory.push('/s/lists/data-models');
      setSubmitting(false);
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox status="error" onClose={onClose} message={e} />,
      });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let _columns: any[] = [];

    Object.values(addedColumns).forEach((i: any) => {
      _columns.push(
        ...i.columns.map((j: any) => ({
          source: i.table_name,
          code: j.value,
          key: `${i.table_name}.${j.value}`,
          name: j.value,
          kind: 'plain',
          data_type: estimateDataType(j.data_type),
        })),
      );
    });

    setColumns(_columns);
  }, [addedColumns]);

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: { name: '', description: '' },
    onSubmit: proceed,
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

  return (
    <>
      <Box className="description">
        Review the summary of your data model schema and make any changes you might need to
      </Box>

      <Box my="2rem" color="#333333">
        <Input2
          label="Name"
          name="name"
          mb="1.5rem"
          placeholder="A distinct name for your data model"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          onReset={handleReset}
          errorMessage={errors.name}
          autoFocus
        />
        <Input2
          label="Description"
          placeholder="Brief description of your data model"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          onReset={handleReset}
          errorMessage={errors.description}
        />
      </Box>
      <Box my="0.5rem" fontWeight="500" color="#333333">
        Mapping
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        my="0.5rem"
        maxH="60vh"
        overflowY="scroll"
        color="#333333"
      >
        {Object.values(addedColumns).map((i: any, index_i) => (
          <Box key={index_i} mb="1rem">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              color="#737373"
              fontWeight="500"
            >
              <Box marginRight="1rem">{i.table_name}</Box>
              <Divider width="100%" />
              {index_i === 0 && (
                <Box
                  marginLeft="20px"
                  fontSize="10px"
                  color="#32a852"
                  textAlign="center"
                  alignSelf="center"
                  backgroundColor="rgba(50, 168, 82, 0.2)"
                  borderRadius="5px"
                  padding="2px 5px"
                >
                  base
                </Box>
              )}
              {index_i > 0 && (
                <Box
                  marginLeft="20px"
                  fontSize="10px"
                  color="#0f0f0fcc"
                  textAlign="center"
                  alignSelf="center"
                  backgroundColor="#0f0f0f1a"
                  minWidth="max-content"
                  borderRadius="5px"
                  padding="2px 5px"
                >
                  {`${i.relationship.target.split('.')[1]} = ${i.relationship.base} `}
                </Box>
              )}
            </Box>
            {i.columns.map((j: any, index_j: number) => (
              <Box key={`${index_i}-${index_j}`}>
                <Box
                  display="flex"
                  flexDirection="row"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  marginY="1rem"
                >
                  <Input
                    isDisabled
                    size="sm"
                    value={j.value}
                    _disabled={{
                      color: '#333333',
                    }}
                    borderRadius="8px"
                    mr="1rem"
                  />
                  <Box width="95%">
                    <Select
                      label="Type"
                      size="sm"
                      value={
                        columns.find((k: any) => k.key === i.table_name + '.' + j.value)?.data_type
                      }
                      onChange={event => {
                        const column = columns.find(
                          (k: any) => k.key === i.table_name + '.' + j.value,
                        );

                        const columnIndex = columns.findIndex(
                          (k: any) => k.key === i.table_name + '.' + j.value,
                        );

                        const updatedColumn = { ...column, data_type: event.target.value };
                        const updatedColumns = [...columns];
                        updatedColumns[columnIndex] = updatedColumn;
                        setColumns(updatedColumns);
                      }}
                    >
                      <option value="TEXT">Text</option>
                      <option value="NUMBER">Number</option>
                      <option value="PHONE NUMBER">Phone Number</option>
                      <option value="EMAIL">Email</option>
                      <option value="DATE">Date</option>
                      <option value="URL">URL</option>
                    </Select>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="flex-end" mt="1rem">
        <Button
          variantColor="blue"
          variant="solid"
          onClick={formik.handleSubmit}
          isLoading={isSubmitting}
          size="sm"
        >
          Create data model
        </Button>
      </Box>
    </>
  );
};
