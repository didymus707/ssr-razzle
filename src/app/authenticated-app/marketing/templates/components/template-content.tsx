import { Box, Flex, Skeleton, Stack } from '@chakra-ui/core';
import React from 'react';
import { EmptyState, Button } from 'app/components';
import emptyClipImage from '../templates-empty.svg';
import { TemplateData } from '../templates.types';
import { TemplateListItem } from './template-list-item';
import { ListSearch } from 'app/authenticated-app/lists/components/search';

type Props = {
  isLoading?: boolean;
  tableActions: any[];
  selectedTab: string;
  searchQuery?: string;
  categories: string[];
  lists_by_id?: string[];
  selectedCategory: string;
  templates: TemplateData[];
  onSearch(query: string): void;
  sampleTemplates: TemplateData[];
  onTabChange: (tab: string) => void;
  handleCategoryClick(category: string): void;
  stateOptions: { label: string; value: string }[];
  onTemplateItemClick: (data: TemplateData) => void;
};

export const TemplateContent = (props: Props) => {
  const {
    onSearch,
    isLoading,
    templates,
    categories,
    selectedTab,
    onTabChange,
    lists_by_id,
    searchQuery,
    tableActions,
    stateOptions,
    sampleTemplates,
    selectedCategory,
    handleCategoryClick,
    onTemplateItemClick,
  } = props;
  return (
    <div>
      <Box className="section-title">
        <Stack isInline alignItems="center">
          <Stack spacing="0" isInline rounded="4px" borderWidth="1px" alignItems="center">
            {stateOptions.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === stateOptions.length - 1;

              let borderRadiusStyles = {};

              if (isFirst) {
                borderRadiusStyles = {
                  roundedTopLeft: '4px',
                  roundedBottomLeft: '4px',
                };
              }
              if (isLast) {
                borderRadiusStyles = {
                  roundedTopRight: '4px',
                  roundedBottomRight: '4px',
                };
              }

              return (
                <Box
                  py="0.4rem"
                  width="150px"
                  fontWeight="500"
                  cursor="pointer"
                  textAlign="center"
                  fontSize="0.875rem"
                  borderRightWidth={isLast ? '0' : '1px'}
                  onClick={() => onTabChange(item.value)}
                  color={selectedTab === item.value ? 'white' : 'black'}
                  backgroundColor={selectedTab === item.value ? 'blue.500' : 'transparent'}
                  {...borderRadiusStyles}
                >
                  {item.label}
                </Box>
              );
            })}
          </Stack>

          <ListSearch height="36px" search_query={searchQuery ?? ''} updateSearchQuery={onSearch} />
        </Stack>
      </Box>
      {selectedTab === 'my-templates' ? (
        isLoading ? (
          <Stack>
            {Array.from({ length: 15 }, (v, i) => (
              <Flex
                px="1rem"
                pt="1rem"
                alignItems="center"
                borderTopWidth="1px"
                justifyContent="space-between"
                key={`${i.toString()}-${new Date().getTime()}`}
              >
                <Box width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}>
                  <Skeleton height="10px" width="80%" my="10px" />
                  <Skeleton height="10px" width="50%" my="10px" />
                  <Skeleton height="10px" width="25%" my="10px" />
                </Box>
                <Flex
                  justifyContent="flex-end"
                  width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}
                >
                  <Skeleton height="10px" width="60px" my="10px" />
                </Flex>
              </Flex>
            ))}
          </Stack>
        ) : (
          <Box>
            {!templates.length ? (
              <EmptyState
                py="100px"
                imageSize="120px"
                image={emptyClipImage}
                heading="No saved templates"
                contentContainerProps={{ mt: '1rem' }}
                subheading="A template is a saved message that can be reused"
              />
            ) : (
              templates.map(template => (
                <TemplateListItem
                  key={template.id}
                  template={template}
                  tableActions={tableActions}
                  onClick={onTemplateItemClick}
                  hasActiveTable={
                    !template.table_id ||
                    (!!template.table_id && !!lists_by_id?.includes(template.table_id))
                  }
                />
              ))
            )}
          </Box>
        )
      ) : (
        <Box>
          {!sampleTemplates.length ? (
            <EmptyState
              py="100px"
              imageSize="120px"
              image={emptyClipImage}
              heading="No sample templates"
              contentContainerProps={{ mt: '1rem' }}
              subheading="A template is a saved message that can be reused"
            />
          ) : (
            <>
              <Stack isInline alignItems="center" overflowY="auto" mb="0.5rem">
                {categories?.map((category, index) => (
                  <Button
                    size="sm"
                    minW="unset"
                    fontWeight={500}
                    fontSize="0.75rem"
                    key={index.toString()}
                    textTransform="capitalize"
                    _focus={{ boxShadow: 'none' }}
                    _active={{ boxShadow: 'none' }}
                    onClick={() => handleCategoryClick(category)}
                    color={selectedCategory === category ? 'white' : 'gray.900'}
                    variantColor={selectedCategory === category ? 'blue' : 'gray'}
                  >
                    {category}
                  </Button>
                ))}
              </Stack>
              {sampleTemplates.map(template => (
                <TemplateListItem
                  key={template.id}
                  template={template}
                  showActionBtns={false}
                  tableActions={tableActions}
                />
              ))}
            </>
          )}
        </Box>
      )}
    </div>
  );
};
