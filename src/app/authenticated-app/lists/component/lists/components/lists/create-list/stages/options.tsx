import React from 'react';
import { Box, BoxProps, Divider, Icon, SimpleGrid, Spinner } from '@chakra-ui/core/dist';

interface ButtonProps {
  icon: string;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?(): void;
}

const OptionButton = ({
  onClick,
  icon,
  label,
  disabled,
  loading,
  ...rest
}: ButtonProps & BoxProps) => (
  <Box
    className={`create-button ${disabled && 'disabled'}`}
    onClick={() => {
      if (!loading && onClick) onClick();
    }}
    {...rest}
  >
    <Icon className="icon" name={icon} size="14px" />
    <Box className="text">{label}</Box>
    {loading && <Spinner size="xs" marginLeft="auto" />}
    {disabled && <Box className="coming-soon">coming soon</Box>}
  </Box>
);

interface Props {
  createListLoading?: boolean;
  selectImportType: Function;
  createList: Function;
  addFromTemplateLoading: string | null;
  handleAddFromTemplate: Function;
}

export const CreateListOptions = (props: Props) => {
  const {
    createListLoading,
    selectImportType,
    handleAddFromTemplate,
    addFromTemplateLoading,
  } = props;

  return (
    <Box>
      <Box className="section">
        <Box className="title">
          <Box className="title-text">From scratch</Box>
          <Divider height="2px" orientation="horizontal" width="100%" />
        </Box>

        <Box className="description">
          Create new blank list with custom fields and property types
        </Box>

        <OptionButton
          icon="small-add"
          label="Start from scratch"
          onClick={() => props.createList()}
          loading={createListLoading}
          width={220}
        />
      </Box>

      <Box className="section">
        <Box className="title">
          <Box className="title-text">Import data</Box>
          <Divider height="2px" orientation="horizontal" width="100%" />
        </Box>

        <Box className="description">Bring your existing data into Simpu</Box>

        <SimpleGrid minChildWidth={200} spacing="25px">
          <OptionButton icon="csvFile" label="CSV file" onClick={() => selectImportType('csv')} />
          <OptionButton
            icon="ms-excel"
            label="Microsoft Excel"
            onClick={() => selectImportType('ms-excel')}
          />
          <OptionButton
            icon="ios-numbers"
            label="Apple Numbers"
            onClick={() => selectImportType('apple-numbers')}
          />
          <OptionButton
            icon="ms-access"
            label="Microsoft Access"
            onClick={() => selectImportType('csv')}
          />
          <OptionButton icon="asana" label="Asana" onClick={() => selectImportType('asana')} />
          <OptionButton icon="trello" label="Trello" onClick={() => selectImportType('trello')} />
          <OptionButton
            icon="g-sheets"
            label="Google Sheets"
            onClick={() => selectImportType('google-sheets')}
          />
          <OptionButton icon="mysql" label="MySQL" onClick={() => selectImportType('mysql')} />
          <OptionButton
            icon="postgreSql"
            label="PostgreSQL"
            onClick={() => selectImportType('pgsql')}
          />
          <OptionButton
            icon="woo-commerce"
            label="WooCommerce"
            onClick={() => selectImportType('woo-commerce')}
          />
          <OptionButton
            icon="shopify"
            label="Shopify"
            onClick={() => selectImportType('shopify')}
          />
          <OptionButton icon="mambu" label="Mambu" onClick={() => selectImportType('mambu')} />
          <OptionButton icon="ios-contacts" label="Contacts" disabled />
          <OptionButton icon="calendar2" label="Calendar" disabled />
        </SimpleGrid>
      </Box>

      <Box className="section">
        <Box className="title">
          <Box className="title-text" width="35% important">
            Use a template
          </Box>
          <Divider height="2px" orientation="horizontal" width="100%" />
        </Box>

        <Box className="description">Select a template to get started and customize as you go.</Box>

        <SimpleGrid minChildWidth={200} spacing="25px">
          <OptionButton
            icon="phone"
            label="Contact list"
            onClick={() => handleAddFromTemplate('contact_template')}
            loading={addFromTemplateLoading === 'contact_template'}
          />
          <OptionButton
            icon="at-sign"
            label="Sales CRM"
            onClick={() => handleAddFromTemplate('sales_crm')}
            loading={addFromTemplateLoading === 'sales_crm'}
          />
          <OptionButton
            icon="chat"
            label="Personal CRM"
            onClick={() => handleAddFromTemplate('personal_crm')}
            loading={addFromTemplateLoading === 'personal_crm'}
          />
          <OptionButton
            icon="dollar"
            label="Expense tracker"
            onClick={() => handleAddFromTemplate('expense_tracker')}
            loading={addFromTemplateLoading === 'expense_tracker'}
          />
          <OptionButton
            icon="hamburger"
            label="Product Inventory"
            onClick={() => handleAddFromTemplate('product_inventory')}
            loading={addFromTemplateLoading === 'product_inventory'}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};
