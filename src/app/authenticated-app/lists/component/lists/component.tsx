import React, { useEffect, useState } from 'react';
import { ContentWrapper } from '../../../../components';
import { Wrapper } from './component.styles';
import { useHistory } from 'react-router-dom';
import { ListSidebar } from './component.sidebar';
import { ListContent } from './component.content';
import { ListVisualization } from '../../lists.types';
import Cookie from 'js-cookie';

export const Component = (props: any) => {
  const [visualization, setVisualization] = useState<ListVisualization>('grid');
  const [searchValue, setSearchValue] = useState<string>('');

  const {
    selectedTab,
    addList,
    addListFromTemplate,
    handleImport,
    handleImportMapping,
    handleImportNewTable,
    importedData,
  } = props;

  const router_history = useHistory();

  useEffect(() => {
    props.resetSelectedList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init_visualization();
  }, []);

  useEffect(() => {
    setSearchValue('');
  }, [selectedTab]);

  const init_visualization = () => {
    const _visualization = Cookie.get('lists_visualization');
    if (!_visualization) return Cookie.set('lists_visualization', 'grid');
    if (!['list', 'grid'].includes(_visualization)) {
      return Cookie.set('lists_visualization', 'grid');
    }
    // @ts-ignore
    setVisualization(_visualization);
  };

  const selectTab = (tab_name: string) => {
    if (selectedTab === tab_name) return;
    else router_history.push(`/s/lists/${tab_name}`);
  };

  return (
    <ContentWrapper paddingBottom="8rem">
      <Wrapper>
        <ListSidebar
          {...{
            searchValue,
            setSearchValue,
            visualization,
            setVisualization,
            selectedTab,
            selectTab,
            totalLists: props.lists_by_id.length,
          }}
        />
        <ListContent
          {...{
            searchValue,
            visualization,
            selectTab,
            selectedTab,
            addList,
            addListFromTemplate,
            handleImport,
            handleImportMapping,
            handleImportNewTable,
            importedData,
          }}
        />
      </Wrapper>
    </ContentWrapper>
  );
};
