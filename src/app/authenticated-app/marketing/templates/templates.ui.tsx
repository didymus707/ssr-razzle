import { Box, Flex, Heading, useDisclosure, useToast } from '@chakra-ui/core';
import { Button, ConfirmModal, SmallText, TableDropdownAction, ToastBox } from 'app/components';
import * as React from 'react';
import { useLoading } from '../../../../hooks';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import { TemplateFormValues, TemplateModal } from './components';
import { TemplateContent } from './components/template-content';
import { TemplateData, TemplatesContainerProps } from './templates.types';
import { html2Text } from './templates.utils';

export function TemplatesComponent(props: TemplatesContainerProps) {
  const {
    lists,
    templates,
    addTemplate,
    lists_by_id,
    editTemplate,
    removeTemplate,
    fetchTemplates,
    sampleTemplates,
    templateCategories,
    fetchSampleTemplates,
    templatesSearchResults,
  } = props;
  const mappedTemplateCategories = templateCategories.map(item => item.category);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState('my-templates');
  const [templateToEdit, setTemplateToEdit] = React.useState<TemplateData | undefined>();
  const [templateToDelete, setTemplateToDelete] = React.useState<TemplateData | undefined>();
  const [selectedCategory, setSelectedCategory] = React.useState(mappedTemplateCategories[0]);
  const [templateToDuplicate, setTemplateToDuplicate] = React.useState<TemplateData | undefined>();
  const tableActions = [
    {
      icon: 'copy',
      label: 'Duplicate template',
      onClick: (data: TemplateData) => setTemplateToDuplicate(data),
    },
    {
      icon: 'delete',
      label: 'Delete template',
      onClick: (data: TemplateData) => setTemplateToDelete(data),
    },
  ] as TableDropdownAction<TemplateData>[];

  const listOptions = lists_by_id
    //@ts-ignore
    .map((id: string) => lists[id])
    .map(({ name, id }: { name: string; id: string }) => ({ label: name, value: id }));

  const toast = useToast();
  const { dispatch, loading, globalLoading } = useLoading();

  async function handleFetchCategoryTemplates(category: string) {
    try {
      setSelectedCategory(category);
      dispatch({ type: 'LOADING_STARTED' });
      await fetchSampleTemplates({ category });
      dispatch({ type: 'LOADING_RESOLVED' });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  async function handleSearchTemplates(query: string) {
    if (query) {
      try {
        dispatch({ type: 'GLOBAL_LOADING_STARTED' });
        await templatesSearchResults(query);
        dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      } catch (error) {
        dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    } else {
      try {
        dispatch({ type: 'GLOBAL_LOADING_STARTED' });
        await fetchTemplates();
        dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      } catch (error) {
        dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    }
  }

  async function handleAddTemplate(template: TemplateData) {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await addTemplate(template);
      dispatch({ type: 'LOADING_RESOLVED' });
      onClose();
      sendAmplitudeData('templateAdded');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} status="success" message="Template created" />
        ),
      });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  async function handleDuplicateTemplate() {
    if (templateToDuplicate) {
      const { id, ...rest } = templateToDuplicate;
      try {
        dispatch({ type: 'LOADING_STARTED' });
        await addTemplate(rest);
        dispatch({ type: 'LOADING_RESOLVED' });
        setTemplateToDuplicate(undefined);
        sendAmplitudeData('templateDuplicated');
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox onClose={onClose} status="success" message="Template duplicated" />
          ),
        });
      } catch (error) {
        dispatch({ type: 'LOADING_RESOLVED' });
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    }
  }

  async function handleUpdateTemplate(payload: TemplateFormValues) {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      // @ts-ignore
      await editTemplate({ ...payload, template: html2Text(payload.template) });
      dispatch({ type: 'LOADING_RESOLVED' });
      setTemplateToEdit(undefined);
      sendAmplitudeData('templateUpdated');
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} status="success" message="Template edited" />
        ),
      });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  async function handleDeleteTemplate() {
    if (templateToDelete) {
      try {
        dispatch({ type: 'LOADING_STARTED' });
        await removeTemplate(templateToDelete.id);
        dispatch({ type: 'LOADING_RESOLVED' });
        setTemplateToDelete(undefined);
        sendAmplitudeData('templateDeleted');
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox onClose={onClose} status="success" message="Template deleted" />
          ),
        });
      } catch (error) {
        dispatch({ type: 'LOADING_RESOLVED' });
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    }
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
  }

  React.useEffect(() => {
    handleFetchCategoryTemplates(mappedTemplateCategories[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Flex pb="2.5rem" alignItems="center" justifyContent="space-between">
        <Box>
          <Heading as="h4" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
            Templates
          </Heading>
          <SmallText maxW="500px" color="#4f4f4f" fontSize="0.875rem">
            Easily design templated messages for your campaigns to reach your customers.
          </SmallText>
        </Box>
        <Button size="sm" variantColor="blue" onClick={onOpen}>
          Create template
        </Button>
      </Flex>
      <TemplateContent
        templates={templates}
        selectedTab={activeTab}
        lists_by_id={lists_by_id}
        tableActions={tableActions}
        onTabChange={handleTabChange}
        onSearch={handleSearchTemplates}
        sampleTemplates={sampleTemplates}
        selectedCategory={selectedCategory}
        categories={mappedTemplateCategories}
        isLoading={globalLoading === 'pending'}
        handleCategoryClick={handleFetchCategoryTemplates}
        stateOptions={[
          { label: 'My Templates', value: 'my-templates' },
          { label: 'Sample Templates', value: 'sample-templates' },
        ]}
        onTemplateItemClick={(data: TemplateData) => setTemplateToEdit(data)}
      />
      <TemplateModal
        lists={lists}
        isOpen={isOpen}
        onClose={onClose}
        title="Add template"
        listOptions={listOptions}
        lists_by_id={lists_by_id}
        onSubmit={handleAddTemplate}
        isLoading={loading === 'pending'}
      />
      <TemplateModal
        lists={lists}
        title="Edit template"
        listOptions={listOptions}
        isOpen={!!templateToEdit}
        lists_by_id={lists_by_id}
        initialValues={templateToEdit}
        onSubmit={handleUpdateTemplate}
        isLoading={loading === 'pending'}
        onClose={() => setTemplateToEdit(undefined)}
      />
      <ConfirmModal
        title="Duplicate template"
        isOpen={!!templateToDuplicate}
        isLoading={loading === 'pending'}
        onConfirm={handleDuplicateTemplate}
        onClose={() => setTemplateToDuplicate(undefined)}
      />
      <ConfirmModal
        title="Delete template"
        isOpen={!!templateToDelete}
        onConfirm={handleDeleteTemplate}
        isLoading={loading === 'pending'}
        onClose={() => setTemplateToDelete(undefined)}
      />
    </>
  );
}
