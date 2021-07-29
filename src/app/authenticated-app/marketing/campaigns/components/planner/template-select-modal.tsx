import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  PseudoBox,
  Skeleton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/core';
import React from 'react';
import { useLoading } from '../../../../../../hooks';
import {
  Button,
  EmptyState,
  ModalContainer,
  ModalContainerOptions,
  Search,
  ToastBox,
} from 'app/components';
import { TemplateData } from '../../../templates';
import emptyTemplates from '../../assets/empty-inbox.svg';

type TemplateSelectModalProps = {
  goBack?(): void;
  categories?: string[];
  selectedTemplate?: string | null;
  fetchTemplates: (params?: any) => any;
  fetchSampleTemplates: (params: any) => any;
  onSelectTemplate?(template: TemplateData): void;
} & ModalContainerOptions;

export const TemplateSelectModal = ({
  isOpen,
  onClose,
  goBack,
  categories,
  fetchTemplates,
  onSelectTemplate,
  selectedTemplate,
  fetchSampleTemplates,
}: TemplateSelectModalProps) => {
  const [searchValue, setSearchValue] = React.useState('');
  let [templates, setTemplates] = React.useState<TemplateData[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState('my-templates');

  const toast = useToast();
  const { dispatch, loading } = useLoading();

  templates = templates.filter(
    (template: TemplateData) =>
      template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      template.template.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleGoBack = () => {
    goBack?.();
    onClose?.();
  };

  const handleFetchCategoryTemplates = async (category: string) => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      const { templates } = await fetchSampleTemplates({ category });
      setTemplates(templates);
      dispatch({ type: 'LOADING_RESOLVED' });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleFetchTemplates = async () => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      const { templates } = await fetchTemplates();
      setTemplates(templates);
      dispatch({ type: 'LOADING_RESOLVED' });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === 'my-templates') {
      handleFetchTemplates();
    } else {
      handleFetchCategoryTemplates(category);
    }
  };

  const handleTemplateSearch = (value: string) => {
    setSearchValue(value);
  };

  React.useEffect(() => {
    handleFetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalContainer
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      titleStyleProps={{ fontSize: '1rem', width: '320px' }}
    >
      <Box py="1.5rem">
        <Box px="1.5rem">
          <Flex pb="1rem" alignItems="center" justifyContent="space-between">
            <Stack isInline alignItems="center">
              <IconButton
                size="xs"
                variant="ghost"
                icon="arrow-back"
                aria-label="back"
                onClick={handleGoBack}
              />
              <Heading fontSize="1.2rem">Templates</Heading>
            </Stack>
          </Flex>
          <Search
            mb="0.5rem"
            value={searchValue}
            placeholder="Search templates"
            onChange={handleTemplateSearch}
          />
        </Box>
        <Stack isInline alignItems="center" overflowY="auto" m="0.5rem 1.5rem">
          <Button
            size="sm"
            minW="unset"
            fontWeight={500}
            fontSize="0.75rem"
            textTransform="capitalize"
            onClick={() => handleCategoryClick('my-templates')}
            variantColor={selectedCategory === 'my-templates' ? 'blue' : undefined}
          >
            My Templates
          </Button>
          {categories?.map((category, index) => (
            <Button
              size="sm"
              minW="unset"
              fontWeight={500}
              fontSize="0.75rem"
              key={index.toString()}
              textTransform="capitalize"
              onClick={() => handleCategoryClick(category)}
              variantColor={selectedCategory === category ? 'blue' : undefined}
            >
              {category}
            </Button>
          ))}
        </Stack>
        <Box height="200px" overflowY="auto">
          {!templates?.length && !searchValue && (
            <EmptyState imageSize="100px" subheading="No templates" image={emptyTemplates} />
          )}
          {!templates?.length && searchValue && (
            <EmptyState imageSize="100px" subheading="No templates found" image={emptyTemplates} />
          )}
          {!!templates?.length &&
            templates?.map(template => (
              <TemplateItem
                key={template.id}
                isLoading={loading === 'pending'}
                onClick={() => onSelectTemplate?.(template)}
                isSelected={selectedTemplate === template.id}
                {...template}
              />
            ))}
        </Box>
      </Box>
    </ModalContainer>
  );
};

const TemplateItem = (
  props: TemplateData & { isSelected?: boolean; onClick?: () => void; isLoading?: boolean },
) => {
  const { name, template, onClick, isSelected, isLoading } = props;
  return (
    <PseudoBox
      py="1rem"
      px="1.5rem"
      as="button"
      width="100%"
      textAlign="left"
      borderRadius="0"
      onClick={onClick}
      borderBottomWidth="1px"
      _hover={{
        bg: '#f2f2f2',
        rounded: '8px',
      }}
      _active={{
        outline: 'none',
        boxShadow: 'none',
      }}
      _focus={{
        outline: 'none',
        boxShadow: 'none',
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Skeleton height="20px" pb="0.2rem" isLoaded={!isLoading}>
            <Heading fontSize="0.875rem" pb="0.2rem">
              {name}
            </Heading>
          </Skeleton>
          <Skeleton height="10px" isLoaded={!isLoading}>
            <Text
              maxW="450px"
              color="gray.600"
              overflow="hidden"
              fontSize="0.75rem"
              whiteSpace="nowrap"
              style={{ textOverflow: 'ellipsis' }}
            >
              {template}
            </Text>
          </Skeleton>
        </Box>
        {isSelected && <Icon name="check-circle" size="1.2rem" color="blue.500" />}
      </Flex>
    </PseudoBox>
  );
};
