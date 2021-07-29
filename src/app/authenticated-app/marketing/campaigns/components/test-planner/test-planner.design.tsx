import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { CampaignVariant } from '../../campaigns.types';
import { DesignProps } from '../planner';
import {
  PlannerContentDesign,
  PlannerContentDesignInitialValuesProp,
} from '../planner/planner.content.design';

export const TestPlannerDesign = (props: DesignProps) => {
  const {
    fetchWallet,
    initialValues,
    fetchTemplates,
    credit_balance,
    templateCategories,
    fetchSampleTemplates,
    handleUpdateTemplate,
  } = props;
  const { variants_count, contents, link, sender_id } = initialValues;

  const [tabIndex, setTabIndex] = useState(0);
  const [variants, setVariants] = useState<CampaignVariant[]>(contents ?? []);

  useEffect(() => {
    if (variants_count && !contents) {
      const countArray = Array.from(Array(parseFloat(variants_count)).keys());
      const variants: CampaignVariant[] = countArray.map(item => ({
        action: 'create',
        content: '',
      }));
      setVariants(variants);
    } else {
      setVariants(contents ?? []);
    }
  }, [variants_count, contents]);

  const handleTabsChange = (index: number, values?: PlannerContentDesignInitialValuesProp) => {
    if (values) {
      const { content, template_id } = values ?? {};
      const newVariants = variants.map((v, i) => {
        if (index === i) {
          return {
            ...v,
            content,
            template_id,
            action: v.id && v.content !== content ? 'update' : 'create',
          } as CampaignVariant;
        }
        return v;
      });

      setVariants(newVariants);
    }
    setTabIndex(index);
  };

  const handleSubmit = (index: number, values: PlannerContentDesignInitialValuesProp) => {
    const { content, template_id } = values ?? {};
    const newVariants = variants.map((v, i) => {
      if (index === i) {
        return {
          ...v,
          content,
          template_id,
          action: v.id && v.content !== content ? 'update' : 'create',
        } as CampaignVariant;
      }
      return v;
    });

    setVariants(newVariants);

    if (index < variants.length - 1) {
      handleTabsChange(index + 1);
    } else {
      props.onSubmit({
        ...props.initialValues,
        contents: newVariants,
      });
    }
  };

  const handleGoBack = () => {
    if (tabIndex === 0) {
      props.onGoBack();
    } else {
      handleTabsChange(tabIndex - 1);
    }
  };

  const handleGetContinueButtonLabel = () => {
    if (tabIndex < variants.length - 1) {
      return `Compose message \n variant ${tabIndex + 1}`;
    } else {
      return 'Save & Continue';
    }
  };

  return (
    <>
      <Tabs index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          {variants.map((_, index) => (
            <Tab fontWeight={500} fontSize="0.875rem" key={`${index}`}>
              {`Variant ${index + 1}`}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {variants.map((variant, index) => (
            <TabPanel p={4} key={`${index}`}>
              <PlannerContentDesign
                index={index}
                onGoBack={handleGoBack}
                onTabChange={handleTabsChange}
                onSubmit={values => handleSubmit(index, values)}
                continueButtonLabel={handleGetContinueButtonLabel()}
                initialValues={{
                  link,
                  sender_id,
                  content: variant.content,
                  template_id: variant.template_id,
                }}
                {...{
                  fetchWallet,
                  fetchTemplates,
                  credit_balance,
                  templateCategories,
                  fetchSampleTemplates,
                  handleUpdateTemplate,
                }}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};
