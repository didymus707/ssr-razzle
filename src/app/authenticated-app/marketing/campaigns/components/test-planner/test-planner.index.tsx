import { Box, useToast } from '@chakra-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLoading } from '../../../../../../hooks';
import { sendAmplitudeData } from '../../../../../../utils/amplitude';
import { ContentWrapper, ToastBox } from '../../../../../components';
import { selectOrganisationID } from '../../../../../unauthenticated-app/authentication';
import { TemplateData } from '../../../templates';
import { PlannerProps } from '../../planner.types';
import { CampaignPayload } from '../planner';
import {
  FlowSteps,
  SectionContainer,
  SectionHeader,
  SectionHeaderProps,
} from '../planner/planner.layout';
import { Review } from '../planner/planner.review';
import { Setup } from '../planner/planner.setup';
import { TestPlannerDesign } from './test-planner.design';

export const TestPlanner = (props: PlannerProps & { isSaving?: boolean }) => {
  let {
    lists,
    history,
    isSaving,
    audiences,
    smart_lists,
    addCampaign,
    lists_by_id,
    organisations,
    fetchTemplates,
    audiences_by_id,
    importBulkUpload,
    saveCampaignDraft,
    smart_lists_by_id,
    templateCategories,
    fetchSampleTemplates,
    campaign: campaignData,
    credit_balance,
    updateCampaign,
    template,
    addAudience,
    editTemplate,
    user,
    fetchWallet,
    fetchStates,
    fetchGenders,
    states,
    genders,
    religions,
    ethnicGroups,
    fetchEthnicGroups,
    fetchReligions,
  } = props;

  const toast = useToast();
  const { dispatch, loading } = useLoading();

  const [section, setSection] = React.useState(0);
  const [campaign, setCampaign] = React.useState(campaignData);

  const organizationID = useSelector(selectOrganisationID);
  const currentOrganization = organisations?.find((i: any) => i.id === organizationID);

  const organisationName = currentOrganization?.['name'];
  const mappedTemplateCategories = templateCategories.map(item => item.category);
  const sectionsHeaderProps = {
    0: {
      heading: 'Set up your A/B test',
      subheading: 'Give your A/B test a name and choose who to send to.',
    },
    1: {
      heading: 'Design your campaign',
      subheading: 'Compose your message below.',
    },
    2: {
      heading: 'Review your A/B test before sending',
      subheading: 'Please review your A/B test details before sending.',
    },
  } as { [key: number]: SectionHeaderProps };

  const listOptions = lists_by_id
    //@ts-ignore
    .map((id: string) => lists[id])
    .map(({ name, id }) => ({ label: name, value: id }));

  const smartListOptions = smart_lists_by_id
    //@ts-ignore
    .map((id: string) => smart_lists[id])
    .map(({ name, id }) => ({ label: name, value: `${id}-smartList` }));

  const audienceOptions = audiences_by_id
    //@ts-ignore
    .map((id: string) => audiences[id])
    .map(({ name, id }) => ({ label: name, value: `${id}-audience` }));

  // const importOptions = [{ label: 'Import a CSV/Excel file', value: 'import' }];

  const newAudienceOptions = [{ label: 'Create a new audience', value: 'new-audience' }];

  const allLists =
    user?.account_type === 9
      ? [
          { label: 'New Audience', options: newAudienceOptions, showBadge: false },
          // { label: 'Import', options: importOptions, showBadge: false },
          { label: 'Lists', options: listOptions, showBadge: true },
          { label: 'Smart lists', options: smartListOptions, showBadge: true },
          { label: 'Audiences', options: audienceOptions, showBadge: true },
        ]
      : [
          // { label: 'Import', options: importOptions, showBadge: false },
          { label: 'Lists', options: listOptions, showBadge: true },
          { label: 'Smart lists', options: smartListOptions, showBadge: true },
        ];

  const allStates = states.map(state => ({ value: state, label: state }));
  const allGenders = genders.map(state => ({ value: state, label: state }));
  const allReligions = religions.map(religion => ({ value: religion, label: religion }));
  const allEthnicGroups = ethnicGroups.map(ethnicGroup => ({
    value: ethnicGroup,
    label: ethnicGroup,
  }));

  const handleCancel = () => history.goBack();

  const handleGoBack = () => {
    setSection(section - 1);
  };

  const handleGoToSection = (section: number) => {
    setSection(section);
  };

  const handleSubmit = (data: CampaignPayload) => {
    setCampaign({ ...campaign, ...data });
    setSection(section + 1);
  };

  const handleEditCampaign = async (payload: Partial<CampaignPayload>) => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await updateCampaign(payload);
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Campaign updated successfully" />
        ),
      });
      sendAmplitudeData('campaignUpdated', { data: payload });
      history.push('/s/marketing/campaigns');
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleSaveDraft = async (payload: CampaignPayload) => {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await saveCampaignDraft(payload);
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Campaign saved as draft" />
        ),
      });
      sendAmplitudeData('campaignSavedAsDraft', { data: payload });
      history.push('/s/marketing/campaigns');
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleUpdateTemplate = async (payload: TemplateData) => {
    try {
      await editTemplate(payload);
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleSaveAsDraft = async (payload: Partial<CampaignPayload>) => {
    if (campaign.state && campaign.state === 'draft') {
      await handleEditCampaign(payload);
    } else {
      await handleSaveDraft(payload);
    }
  };

  React.useEffect(() => {
    if (!isEmpty(campaignData) && campaignData.template_id) {
      setCampaign({ ...campaignData, content: template.template });
    }
  }, [campaignData, template]);

  React.useEffect(() => {
    const getAllStates = async () => {
      try {
        await fetchStates();
      } catch (error) {
        console.log(error);
      }
    };
    const getGenders = async () => {
      try {
        await fetchGenders();
      } catch (error) {
        console.log(error);
      }
    };
    const getReligions = async () => {
      try {
        await fetchReligions();
      } catch (error) {
        console.log(error);
      }
    };
    const getEthnicities = async () => {
      try {
        await fetchEthnicGroups();
      } catch (error) {
        console.log(error);
      }
    };

    getAllStates();
    getGenders();
    getReligions();
    getEthnicities();
  }, [fetchStates, fetchGenders, fetchEthnicGroups, fetchReligions]);

  return (
    <ContentWrapper p="1.875rem">
      <SectionContainer>
        <Box pb="2rem">
          <SectionHeader pb="1rem" {...sectionsHeaderProps[section]} />
          <FlowSteps activeSection={section} />
        </Box>
        {section === 0 && (
          <Setup
            isAbTest
            lists={allLists}
            states={allStates}
            genders={allGenders}
            onGoBack={handleCancel}
            onSubmit={handleSubmit}
            initialValues={campaign}
            religions={allReligions}
            addAudience={addAudience}
            ethnicGroups={allEthnicGroups}
            organisationName={organisationName}
            importBulkUpload={importBulkUpload}
            hasAudiences={!!audiences_by_id.length}
          />
        )}
        {section === 1 && (
          <TestPlannerDesign
            onGoBack={handleGoBack}
            onSubmit={handleSubmit}
            initialValues={campaign}
            fetchWallet={fetchWallet}
            fetchTemplates={fetchTemplates}
            credit_balance={credit_balance}
            fetchSampleTemplates={fetchSampleTemplates}
            handleUpdateTemplate={handleUpdateTemplate}
            templateCategories={mappedTemplateCategories}
          />
        )}
        {section === 2 && (
          <Review
            isAbTest
            campaign={campaign}
            isSaving={isSaving}
            onSubmit={addCampaign}
            onGoBack={handleGoBack}
            credit_balance={credit_balance}
            onSaveDraft={handleSaveAsDraft}
            onGoToSection={handleGoToSection}
            isSavingDraft={loading === 'pending'}
          />
        )}
      </SectionContainer>
    </ContentWrapper>
  );
};
