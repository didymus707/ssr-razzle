import { Box, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import { ContentWrapper, Search } from '../../components';
import { Wrapper } from '../lists/lists.styles';
import { fetchSupportedChannels } from './channel.thunks';
import { appCategories, getCategoryDetail, getErrorFromQuery } from './channels.data';
import { ChannelProps, ErrorModalProps } from './channels.types';
import { AppItem, ErrorModal } from './components';

type CategoriesType = 'All' | 'Social Channels' | 'Simpu Custom Integrations' | 'Payment Integrations' |
'eCommerce' | 'Core Banking System' | 'Databases' | 'CRM/CDP' |
'Marketing Tools' | 'Tag Managers';

export function ChannelsComponents({ metaData = [] }: ChannelProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesType>('All');
  const [details, setDetails] = useState<{
    title: string;
    items: string[];
  }[]>(getCategoryDetail(selectedCategory));
  const [errorDetail, setErrorDetail] = useState<Pick<ErrorModalProps, 'title' | 'description'>>({
    title: '', description: ''
  });

  const onSearch = (search: string) => {
    if (search.length === 0) {
      return setDetails(getCategoryDetail(selectedCategory));
    }

    setDetails(getCategoryDetail('Search', search));
  }

  const onCategoryClick = (item: CategoriesType) => {
    setSelectedCategory(item);
    setDetails(getCategoryDetail(item));
  }

  useEffect(() => {
    dispatch(fetchSupportedChannels());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { search } = location;
    if (search) {
      const error = getErrorFromQuery(search);
      error && setErrorDetail(error);
      error.description && setIsModalOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <ContentWrapper paddingBottom="1rem">
      <Wrapper>
        <Box className="side-bar">
          <Box className="search-section">
            <Search
              width="100%"
              onChange={onSearch}
              placeholder="Search"
              marginBottom={['0.5rem', 0, 0, 0]}
            />
          </Box>

          {['All', ...Object.keys(appCategories)].map((item) => (
            <Box
              key={item}
              onClick={() => onCategoryClick(item as CategoriesType)}
              className={`option-item ${selectedCategory === item && 'active'}`}
            >
              <Icon
                name={item === 'All' ? 'campaign-all' : item}
                size="14px"
                marginRight="10px"
              />
              <Text className="text">
                {item === 'All' ? item : (appCategories as any)[item]}
              </Text>
            </Box>
          ))}
        </Box>

        <Box className="content">
          <Stack spacing="2.1875rem">
            {details.map(({ title, items }) => (
              <Box key={title}>
                <Box className="section-title">
                  <Text className="title">{title}</Text>
                </Box>

                <SimpleGrid columns={3} spacing="1rem">
                  {items.map((item) => (
                    <NavLink key={item} to={`/s/integrations/${item}`}>
                      <AppItem name={item} />
                    </NavLink>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Stack>
        </Box>
      </Wrapper>

      <ErrorModal {...errorDetail} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </ContentWrapper>
  );
}
