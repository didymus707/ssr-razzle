import React, { useEffect, useState } from 'react';
import { Box, IconButton, useToast } from '@chakra-ui/core/dist';
import { List, ListImportType } from '../../../../../lists.types';
import { useSelector } from 'react-redux';
import { selectActiveSubscription } from '../../../../../../settings';
import { selectListCount } from '../../../../../lists.selectors';
import { useHistory } from 'react-router';
import {
  generateRandomListColor,
  generateRandomListIcon,
  getAllowCreateList,
} from '../../../../../lists.utils';
import { CreateListWrapper as Wrapper } from './index.styles';
import { CreateListOptions } from './stages/options';
import { DEFAULTTABLE } from '../../../../../../tables/tables.data';
import { selectUserID } from '../../../../../../../unauthenticated-app/authentication';
import { ToastBox } from '../../../../../../../components';
import { TemplateTypes } from '../../../../../../tables';
import { CreateListUploadPrompt } from './stages/upload-prompt';
import { CreateListImportMapping } from './stages/mapping';
import { CreateListImportSuccessPrompt } from './stages/success-prompt';
import { PropertySchema } from '../../../../../../tables/components';
import { SelectListResource } from './stages/select-resource';
import { SelectListSource } from './stages/select-source';
import { CreateListSchemaMapping } from './stages/schema-mapping';

interface Props {
  importedData: any;
  addList: Function;
  addListFromTemplate: Function;
  openNoSubscriptionModal: Function;
  handleImport: Function;
  handleImportMapping: Function;
  handleImportNewTable: Function;
  fetchGSheetSpreadSheets: Function;
  fetchGSheetMetadata: Function;
  queueResourceImport: Function;
  queueAppImport: Function;
  fetchResourceSchema: Function;
  fetchAppEndpoints: Function;
  fetchAppEndpointSchema: Function;
}

export const CreateList = (props: Props) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [importType, setImportType] = useState<ListImportType | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [sourceMeta, setSourceMeta] = useState<any[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<null | string>(null);
  const [selectedSource, setSelectedSource] = useState<null | string>(null);

  const [sources, setSources] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<
    | 'options'
    | 'upload-prompt'
    | 'import-mapping'
    | 'select-resource'
    | 'select-source'
    | 'schema-mapping'
    | 'success-prompt'
  >('options');
  const [importedList, setImportedList] = useState<List | null>(null);
  const [createListLoading, setCreateListLoading] = useState<boolean>(false);
  const [addFromTemplateLoading, setAddFromTemplateLoading] = useState<TemplateTypes | null>(null);

  const {
    addList,
    addListFromTemplate,
    openNoSubscriptionModal,
    importedData,
    fetchGSheetSpreadSheets,
    fetchGSheetMetadata,
    queueResourceImport,
    queueAppImport,
    fetchResourceSchema,
  } = props;

  const toast = useToast();
  const routerHistory = useHistory();

  const userID = useSelector(selectUserID);
  const activeSubscription: any = useSelector(selectActiveSubscription);
  const listCount: number = useSelector(selectListCount);
  const allowCreateList = getAllowCreateList(activeSubscription, listCount);

  const goBack = () => {
    if (stage === 'options') routerHistory.push('/s/lists');
    else {
      if (stage === 'upload-prompt') {
        setStage('options');
        setImportType(null);
        setFile(null);
      }
      if (stage === 'import-mapping') {
        setStage('upload-prompt');
        setFile(null);
      }

      if (stage === 'select-resource') {
        setStage('options');
      }
      if (stage === 'select-source') {
        setStage('select-resource');
      }
      if (stage === 'schema-mapping') {
        setStage('select-source');
      }
    }
  };

  const handleCreateList = async () => {
    setCreateListLoading(true);
    try {
      const { table } = await addList({
        user_id: userID,
        columns: DEFAULTTABLE.properties,
        name: 'Untitled',
        color: generateRandomListColor(),
        icon: generateRandomListIcon(),
      });
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="success" message="List created" />,
      });

      return routerHistory.replace(`/s/lists/view/${table.id}`);
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={e} />,
      });
    }
    setCreateListLoading(false);
  };

  const handleCreateListFromTemplate = async (template_type: TemplateTypes) => {
    setAddFromTemplateLoading(template_type);
    try {
      const { table } = await addListFromTemplate({ type: template_type });
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="success" message="List created" />,
      });

      return routerHistory.replace(`/s/lists/view/${table.id}`);
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={e} />,
      });
    }
    setAddFromTemplateLoading(null);
  };

  const handleSelectImportType = (_type: ListImportType) => {
    setImportType(_type);
    if (!_type) return;
    if (['mysql', 'pgsql', 'google-sheets', 'shopify', 'woo-commerce', 'mambu'].includes(_type)) {
      setStage('select-resource');
    } else setStage('upload-prompt');
  };
  const handleUpload = (_file: File) => {
    setFile(_file);
  };

  const handleFileImport = async () => {
    setUploadLoading(true);
    await props.handleImport({
      file,
      source: importType === 'ms-excel' ? 'excel' : 'csv',
      name: file?.name,
      agree: true,
      date_format: '',
    });
    setUploadLoading(false);
  };

  const handleNewTableImport = async (properties: PropertySchema[]) => {
    try {
      const list = await props.handleImportNewTable(properties);
      setImportedList(list);
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="success" message="List import queued successfully" />,
      });
      setStage('success-prompt');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={e} />,
      });
    }
  };

  useEffect(() => {
    if (!allowCreateList && !createListLoading && !!!addFromTemplateLoading) {
      routerHistory.goBack();
      openNoSubscriptionModal({
        heading: "Oops, looks like you've run out of available lists on your subscription",
        subHeading: 'Upgrade to our business plan to create unlimited lists and smart lists',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (importedData) {
      setStage('import-mapping');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedData]);

  return (
    <Box className="content">
      <Box className="section-title">
        <Box className="title">
          {stage !== 'success-prompt' && (
            <IconButton
              icon="arrow-back"
              size="xs"
              borderRadius="10px"
              aria-label="back"
              mr="10px"
              mb="5px"
              onClick={goBack}
            />
          )}
          Create List
        </Box>
      </Box>

      <Wrapper>
        {stage === 'options' && (
          <CreateListOptions
            createList={handleCreateList}
            selectImportType={handleSelectImportType}
            createListLoading={createListLoading}
            addFromTemplateLoading={addFromTemplateLoading}
            handleAddFromTemplate={handleCreateListFromTemplate}
          />
        )}
        {stage === 'upload-prompt' && (
          <CreateListUploadPrompt
            file={file}
            importType={importType}
            handleUpload={handleUpload}
            handleFileImport={handleFileImport}
            uploadLoading={uploadLoading}
          />
        )}
        {stage === 'import-mapping' && (
          <CreateListImportMapping
            importedData={importedData}
            handleCreateTable={handleNewTableImport}
          />
        )}
        {stage === 'success-prompt' && (
          <CreateListImportSuccessPrompt
            proceed={() => routerHistory.replace(`/s/lists/view/${importedList?.id}`)}
          />
        )}
        {stage === 'select-resource' && (
          <SelectListResource
            fetchSources={() => {}}
            setSources={setSources}
            setStage={setStage}
            selectedResource={selectedResource}
            setSelectedResource={setSelectedResource}
            importType={importType}
            fetchGSheetSpreadSheets={fetchGSheetSpreadSheets}
            fetchResourceSchema={fetchResourceSchema}
            fetchAppEndpoints={props.fetchAppEndpoints}
          />
        )}
        {stage === 'select-source' && (
          <SelectListSource
            {...{
              importType,
              sources,
              setStage,
              selectedResource,
              fetchGSheetMetadata,
              sourceMeta,
              setSourceMeta,
              selectedSheet,
              setSelectedSheet,
              selectedSource,
              setSelectedSource,
              fetchAppEndpointSchema: props.fetchAppEndpointSchema,
            }}
          />
        )}
        {stage === 'schema-mapping' && (
          <CreateListSchemaMapping
            {...{
              importType,
              setImportedList,
              setStage,
              selectedResource,
              selectedSheet,
              selectedSource,
              sources,
              sourceMeta,
              queueResourceImport,
              queueAppImport,
            }}
          />
        )}
      </Wrapper>
    </Box>
  );
};
