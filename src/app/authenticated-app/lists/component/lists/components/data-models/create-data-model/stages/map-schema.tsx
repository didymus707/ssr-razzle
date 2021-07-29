import React, { useState } from 'react';
import { Box, Collapse, Icon, IconButton, PseudoBox } from '@chakra-ui/core/dist';
import { Button, EmptyState, Select } from 'app/components';
import noResources from '../../../../../../assets/no-resources.svg';

interface AddedTableItemProps {
  index: number;
  table_name: string;
  relationship: {
    base: string;
    target: string;
  } | null;
  baseTable: any;
  columns: { value: string; data_type: string }[];
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  removeColumn: Function;
  setTableRelationship: Function;
  clearTableRelationship: Function;
}

const AddedTableItem = (props: AddedTableItemProps) => {
  const {
    table_name,
    columns,
    isExpanded,
    expand,
    collapse,
    removeColumn,
    index,
    baseTable,
    relationship,
  } = props;

  const generateRelationshipOptions = () => {
    const options: { label: string; value: string }[] = [];

    columns.forEach((i: any) => {
      baseTable.columns.forEach((j: any) => {
        options.push({
          value: `${table_name}.${i.value} = ${baseTable.table_name}.${j.name}`,
          label: `${i.value} = ${baseTable.table_name}.${j.name}`,
        });
      });
    });
    return options;
  };

  let relationshipOptions: { label: string; value: string }[] = [];

  if (index > 0) {
    relationshipOptions = generateRelationshipOptions();
  }

  return (
    <PseudoBox
      fontWeight="500"
      padding="15px"
      borderRadius="10px"
      cursor="default"
      backgroundColor={isExpanded ? '#FAFAFA' : '#FFFFFF'}
      _hover={{
        backgroundColor: '#FAFAFA',
      }}
      onClick={!isExpanded ? expand : collapse}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Box overflowX="hidden">{table_name}</Box>
          {index === 0 && (
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
        </Box>
        <Box display="flex" alignItems="center">
          {isExpanded ? (
            <Icon name="chevron-up" size="20px" ml="10px" />
          ) : (
            <Icon name="chevron-down" size="20px" ml="10px" />
          )}
        </Box>
      </Box>

      <Box mt="1rem">
        {index !== 0 && (
          <Select
            label="Relationship"
            isInvalid={!relationship}
            errorMessage="Table relationship is required"
            width="100%"
            value={relationship ? `${relationship.target} = ${relationship.base}` : undefined}
            onClick={event => event.stopPropagation()}
            onChange={event => {
              const value = event.target.value;
              if (value === 'null') {
                props.clearTableRelationship(table_name);
              } else {
                const [target, base] = value.split(' = ');
                props.setTableRelationship(table_name, base, target);
              }
            }}
            size="sm"
          >
            <option value="null">Select relationship</option>
            {relationshipOptions.map((i: any) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </Select>
        )}
      </Box>

      <Collapse marginTop="20px" marginBottom="10px" isOpen={isExpanded}>
        {columns.map((i: { value: string; data_type: string }, index: number) => (
          <AddedColumnItem
            key={index}
            name={i.value}
            removeColumn={() => removeColumn(table_name, i)}
          />
        ))}
      </Collapse>
    </PseudoBox>
  );
};

interface TableItemProps {
  columns: any[];
  table_name: string;
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  addColumn: Function;
}

const TableItem = (props: TableItemProps) => {
  const { table_name, columns, isExpanded, expand, collapse, addColumn } = props;

  return (
    <PseudoBox
      fontWeight="500"
      padding="15px"
      borderRadius="10px"
      cursor="default"
      backgroundColor={isExpanded ? '#FAFAFA' : '#FFFFFF'}
      _hover={{
        backgroundColor: '#FAFAFA',
      }}
      onClick={!isExpanded ? expand : collapse}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>{table_name}</Box>
        {isExpanded ? (
          <Icon name="chevron-up" size="20px" />
        ) : (
          <Icon name="chevron-down" size="20px" />
        )}
      </Box>
      <Collapse marginTop="20px" marginBottom="10px" isOpen={isExpanded}>
        {columns.map((i: any, index: number) => (
          <ColumnItem
            key={index}
            {...i}
            addColumn={() => addColumn(table_name, i.name, i.data_type)}
          />
        ))}
      </Collapse>
    </PseudoBox>
  );
};

interface AddedColumnItemProps {
  name: string;
  removeColumn: () => void;
}

const AddedColumnItem = (props: AddedColumnItemProps) => {
  const { name, removeColumn } = props;
  return (
    <PseudoBox
      fontWeight="400"
      fontSize="12px"
      padding="8px"
      borderRadius="8px"
      cursor="pointer"
      _hover={{
        backgroundColor: '#efefef',
      }}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      onClick={event => {
        event.stopPropagation();
      }}
    >
      <Box>{name}</Box>
      <IconButton
        // @ts-ignore
        icon="trash"
        aria-label="remove-column"
        size="xs"
        borderRadius="10px"
        onClick={removeColumn}
        variant="ghost"
        variantColor="red"
      />
    </PseudoBox>
  );
};

interface ColumnItemProps {
  name: string;
  addColumn: () => void;
}

const ColumnItem = (props: ColumnItemProps) => {
  const { name, addColumn } = props;
  return (
    <PseudoBox
      fontWeight="400"
      fontSize="12px"
      padding="8px"
      borderRadius="8px"
      cursor="pointer"
      _hover={{
        backgroundColor: '#efefef',
      }}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      onClick={event => {
        event.stopPropagation();
        addColumn();
      }}
    >
      <Box>{name}</Box>
      <IconButton icon="arrow-right" aria-label="add-column" size="xs" borderRadius="10px" />
    </PseudoBox>
  );
};

interface Props {
  schema: any[];
  goBack: () => void;
  proceed: () => void;
  addedColumns: {
    [key: string]: {
      table_name: string;
      columns: { value: string; data_type: string }[];
      relationship: any;
    };
  };
  setAddedColumns: Function;
}

export const MapSchema = (props: Props) => {
  const [expandedLeft, setExpandedLeft] = useState<string | null>(null);
  const [expandedRight, setExpandedRight] = useState<string | null>(null);

  const { schema, goBack, addedColumns, setAddedColumns, proceed } = props;

  const addColumn = (tableName: string, columnName: string, data_type: string) => {
    if (!addedColumns[tableName]) {
      setAddedColumns({
        ...addedColumns,
        [tableName]: {
          table_name: tableName,
          columns: [{ value: columnName, data_type }],
          relationship: null,
        },
      });
    } else {
      if (!addedColumns[tableName]['columns'].find((i: any) => i.value === columnName)) {
        setAddedColumns({
          ...addedColumns,
          [tableName]: {
            ...addedColumns[tableName],
            columns: [...addedColumns[tableName]['columns'], { value: columnName, data_type }],
          },
        });
      }
    }
    setExpandedRight(tableName);
  };

  const removeColumn = (tableName: string, columnName: string) => {
    if (addedColumns[tableName]['columns'].length > 1) {
      const updatedAddedColumns = {
        ...addedColumns,
        [tableName]: {
          ...addedColumns[tableName],
          columns: addedColumns[tableName]['columns'].filter((i: any) => i.value !== columnName),
        },
      };
      setAddedColumns(updatedAddedColumns);
    } else {
      const updatedAddedColumns = { ...addedColumns };
      delete updatedAddedColumns[tableName];
      setAddedColumns(updatedAddedColumns);
      setExpandedRight(null);
    }
  };

  const setTableRelationship = (table_name: string, base: string, target: string) => {
    const updatedAddedColumns = { ...addedColumns };
    updatedAddedColumns[table_name]['relationship'] = {
      base,
      target,
    };
    setAddedColumns(updatedAddedColumns);
  };

  const clearTableRelationship = (table_name: string) => {
    const updatedAddedColumns = { ...addedColumns };
    updatedAddedColumns[table_name]['relationship'] = null;
    setAddedColumns(updatedAddedColumns);
  };

  const getTable = (tableName: string) => {
    const table = schema.find((i: any) => i.table_name === tableName);
    return table;
  };

  const checkRelationshipsValid = () => {
    if (Object.keys(addedColumns).length === 0) {
      return false;
    }

    const nullRelation = Object.values(addedColumns).find(
      (i: any, index: number) => index > 0 && !i.relationship,
    );
    if (nullRelation) {
      return false;
    }

    return true;
  };

  const isColumnsValid: boolean = checkRelationshipsValid();

  return (
    <>
      {schema.length === 0 && (
        <>
          <EmptyState
            image={noResources}
            paddingY="20px"
            heading={'Oops, no tables available on this database'}
            subheading={`Select a connection that contains tables, so you can import your data`}
            subheadingProps={{
              width: '400px',
            }}
            children={
              <Button variantColor="blue" variant="outline" onClick={goBack}>
                Select data source
              </Button>
            }
          />
        </>
      )}

      {schema.length > 0 && (
        <>
          <Box className="description">
            Select your base table, and then specify joined tables and their relationship conditions
          </Box>
          <Box
            marginTop="30px"
            fontSize="14px"
            color="#333333"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box width="48%">
              <Box fontWeight="500">All columns</Box>
              <Box
                marginTop="15px"
                maxHeight="calc(100vh - 470px)"
                overflowY="scroll"
                paddingLeft="10px"
              >
                {schema.map((i: any, index: number) => (
                  <TableItem
                    key={index}
                    {...i}
                    isExpanded={expandedLeft === i.table_name}
                    expand={() => setExpandedLeft(i.table_name)}
                    collapse={() => setExpandedLeft(null)}
                    addColumn={addColumn}
                  />
                ))}
              </Box>
            </Box>
            <Box width="48%">
              <Box fontWeight="500">Added columns</Box>
              <Box
                marginTop="15px"
                maxHeight="calc(100vh - 470px)"
                overflowY="scroll"
                paddingLeft="10px"
              >
                {Object.keys(addedColumns).map((i: string, index: number) => {
                  return (
                    <AddedTableItem
                      key={i}
                      baseTable={getTable(Object.keys(addedColumns)[0])}
                      index={index}
                      table_name={addedColumns[i]['table_name']}
                      columns={addedColumns[i]['columns']}
                      relationship={addedColumns[i]['relationship']}
                      isExpanded={i === expandedRight}
                      expand={() => setExpandedRight(i)}
                      collapse={() => setExpandedRight(null)}
                      removeColumn={removeColumn}
                      setTableRelationship={setTableRelationship}
                      clearTableRelationship={clearTableRelationship}
                    />
                  );
                })}
                {Object.keys(addedColumns).length === 0 && (
                  <Box>
                    No columns have been added to this data model yet, you can add columns by
                    clicking in the table and column list on the left
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" mt="1rem">
            <Button
              variantColor="blue"
              variant="solid"
              onClick={proceed}
              isDisabled={!isColumnsValid}
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
