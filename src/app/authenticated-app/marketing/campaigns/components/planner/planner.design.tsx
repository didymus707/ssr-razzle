import React from 'react';
import { TemplateData } from '../../../../marketing/templates';
import { PlannerContentDesign } from './planner.content.design';
import { CampaignPayload } from './planner.index';
import { SectionFooterProps } from './planner.layout';

export type DesignInitialValuesProp = Omit<Partial<CampaignPayload>, 'content'> & {
  content: string;
};

export interface DesignProps {
  credit_balance: number;
  goBackButtonLabel?: string;
  continueButtonLabel?: string;
  templateCategories?: string[];
  fetchTemplates: (params?: any) => any;
  onGoBack: SectionFooterProps['onGoBack'];
  fetchSampleTemplates: (params: any) => any;
  fetchWallet: (organization_id: string) => void;
  handleUpdateTemplate: (payload: TemplateData) => Promise<any>;
  initialValues: CampaignPayload;
  onSubmit: (data: CampaignPayload) => void;
}

export const Design = ({
  onGoBack,
  onSubmit,
  fetchWallet,
  initialValues,
  fetchTemplates,
  credit_balance,
  templateCategories,
  fetchSampleTemplates,
  handleUpdateTemplate,
  goBackButtonLabel = 'Back',
  continueButtonLabel = 'Save & Continue',
}: DesignProps) => {
  const { content, template_id, sender_id, link } = initialValues;

  return (
    <>
      <PlannerContentDesign
        onGoBack={onGoBack}
        goBackButtonLabel={goBackButtonLabel}
        continueButtonLabel={continueButtonLabel}
        onSubmit={values =>
          onSubmit({
            ...values,
            ...initialValues,
            content: typeof values.content === 'string' ? values.content : '',
          })
        }
        initialValues={{
          link,
          sender_id,
          template_id,
          content: typeof content === 'string' ? content : '',
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
    </>
  );
};
