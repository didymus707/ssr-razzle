import React from 'react';
import { Box } from '@chakra-ui/core/dist';
import { ListVisualization } from '../../lists.types';
import { Lists, ListResources } from './components';
import { DataModels } from './components/data-models';
import { Segments } from './components/segments';

interface Props {
  searchValue: string;
  selectedTab: string;
  selectTab: Function;
  importedData: any;
  visualization: ListVisualization;
  addList: Function;
  addListFromTemplate: Function;
  handleImport: Function;
  handleImportMapping: Function;
  handleImportNewTable: Function;
}

export const ListContent = (props: Props) => {
  const {
    importedData,
    searchValue,
    visualization,
    selectedTab,
    selectTab,
    addList,
    addListFromTemplate,
    handleImport,
    handleImportMapping,
    handleImportNewTable,
  } = props;

  if (['all', 'lists', 'smart', 'favorites', 'trash'].includes(selectedTab))
    return (
      <Lists
        {...{
          importedData,
          searchValue,
          visualization,
          selectedTab,
          selectTab,
          addList,
          addListFromTemplate,
          handleImport,
          handleImportMapping,
          handleImportNewTable,
        }}
      />
    );

  if (selectedTab === 'connections')
    return (
      <ListResources
        {...{
          searchValue,
          visualization,
        }}
      />
    );

  if (selectedTab === 'data-models')
    return (
      <DataModels
        {...{
          searchValue,
          visualization,
        }}
      />
    );

  if (selectedTab === 'segments')
    return (
      <Segments
        {...{
          searchValue,
          visualization,
        }}
      />
    );

  return <Box />;
};
