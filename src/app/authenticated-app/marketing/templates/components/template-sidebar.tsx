import { Icon } from '@chakra-ui/core';
import React from 'react';
import { Search } from 'app/components';

type Props = {
  selectedTab?: string;
  onSearch(value: string): void;
  selectTab(value: string | undefined): void;
};

export const TemplateSidebar = (props: Props) => {
  const { selectTab, selectedTab, onSearch } = props;

  return (
    <div className="side-bar">
      <div className="search-section">
        <Search
          width="100%"
          onChange={onSearch}
          placeholder="Search"
          marginBottom={['0.5rem', 0, 0, 0]}
        />
      </div>
      <div
        className={`option-item ${selectedTab === 'my-templates' && 'active'}`}
        onClick={() => selectTab('my-templates')}
      >
        <Icon name="campaign-all" size="14px" marginRight="10px" />
        <div className="text">My Templates</div>
      </div>
      <div
        className={`option-item ${selectedTab === 'sample-templates' && 'active'}`}
        onClick={() => selectTab('sample-templates')}
      >
        <Icon name="campaign-all" size="14px" marginRight="10px" />
        <div className="text">Sample Templates</div>
      </div>
    </div>
  );
};
