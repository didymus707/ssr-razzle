import { Box, useToast } from '@chakra-ui/core';
import { AxiosError } from 'axios';
import React, { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { toFormData } from 'utils';
import { ContentWrapper, ToastBox } from '../../../../components';
import {
  selectLists,
  selectListsById,
  selectSegments,
  selectSmartLists,
  selectSmartListsById,
} from '../../../lists';
import { fetchWallet } from '../../../payments';
import { selectCreditBalance } from '../../../payments/selectors';
import {
  editTemplate,
  fetchSampleTemplates,
  fetchTemplates,
  selectTemplateCategories,
  TemplateData,
} from '../../templates';
import {
  campaignImport,
  createCoupon,
  Design,
  FlowSteps,
  SectionContainer,
  SectionHeader,
} from '../../campaigns';
import { CouponReview } from './coupon-review';
import { CouponSetup } from './coupon-setup';

export type CouponPayload = {
  file?: any;
  type?: string;
  name?: string;
  count?: number;
  unique?: boolean;
  content?: string;
  table_id?: string;
  sender_id?: string;
  import_id?: string;
  segment_id?: string;
  timezone?: string;
  smart_list_id?: string;
  audience_id?: string | null;
};

export const CreateCoupon = () => {
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();
  const lists = useSelector(selectLists);
  const segments = useSelector(selectSegments);
  const smart_lists = useSelector(selectSmartLists);
  const lists_by_id = useSelector(selectListsById);
  const smart_lists_by_id = useSelector(selectSmartListsById);
  const credit_balance = useSelector(selectCreditBalance);
  const templateCategories = useSelector(selectTemplateCategories);

  const [section, setSection] = React.useState(0);
  const [payload, setPayload] = React.useState<CouponPayload>({
    unique: true,
    content: 'Use this {{coupon}}',
  });

  const listOptions = lists_by_id
    //@ts-ignore
    .map((id: string) => lists[id])
    .map(({ name, id }) => ({ label: name, value: id }));

  const smartListOptions = smart_lists_by_id
    //@ts-ignore
    .map((id: string) => smart_lists[id])
    .map(({ name, id }) => ({ label: name, value: `${id}-smartList` }));

  const segmentOptions = segments.map(({ name, id }) => ({ label: name, value: `${id}-segment` }));

  const allLists = [
    { label: 'Lists', options: listOptions, showBadge: true },
    { label: 'Smart lists', options: smartListOptions, showBadge: true },
    { label: 'Segments', options: segmentOptions, showBadge: true },
  ];

  const { mutate, isLoading } = useMutation<any, AxiosError, any, any>(
    (payload: CouponPayload) => createCoupon(payload),
    {
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Campaign created successfully" />
          ),
        });
        history.push('/s/marketing/coupons');
      },
      onError: (error, newData, context) => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleCancel = () => history.goBack();

  const handleCreateCoupon = async (payload: Partial<CouponPayload>) => {
    const { file, ...rest } = payload;
    try {
      const importPayload = toFormData(
        { name: file.name, delimiter: 'comma', source: 'csv' },
        file,
        'file',
      );
      const { data } = await campaignImport(importPayload);
      mutate({ ...rest, import_id: data.import.id, type: 'coupon' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoBack = () => {
    setSection(section - 1);
  };

  const handleGoToSection = (section: number) => {
    setSection(section);
  };

  const handleSubmit = (data: any) => {
    setPayload({ ...payload, ...data });
    setSection(section + 1);
  };

  const handleFetchWallet = useCallback(
    organisationId => {
      if (organisationId) {
        dispatch(fetchWallet(organisationId));
      }
    },
    [dispatch],
  );

  const handleFetchTemplates = useCallback(async () => {
    return await dispatch(fetchTemplates());
  }, [dispatch]);

  const handleFetchSampleTemplates = useCallback(
    async payload => {
      return await dispatch(fetchSampleTemplates(payload));
    },
    [dispatch],
  );

  const handleUpdateTemplate = useCallback(
    async (payload: TemplateData) => {
      try {
        dispatch(editTemplate(payload));
      } catch (error) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    },
    [dispatch, toast],
  );

  return (
    <ContentWrapper p="1.875rem">
      <SectionContainer>
        <Box pb="2rem">
          <SectionHeader
            pb="1rem"
            {...{
              heading: 'Create your coupon set',
              subheading: 'Give your coupon a name and choose who to send to.',
            }}
          />
          <FlowSteps activeSection={section} />
        </Box>
        {section === 0 && (
          <CouponSetup
            lists={allLists}
            initialValues={payload}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
        {section === 1 && (
          <Design
            onGoBack={handleGoBack}
            onSubmit={handleSubmit}
            initialValues={payload}
            fetchWallet={handleFetchWallet}
            credit_balance={credit_balance}
            fetchTemplates={handleFetchTemplates}
            templateCategories={templateCategories}
            handleUpdateTemplate={handleUpdateTemplate}
            fetchSampleTemplates={handleFetchSampleTemplates}
          />
        )}
        {section === 2 && (
          <CouponReview
            payload={payload}
            isSaving={isLoading}
            onGoBack={handleGoBack}
            onSubmit={handleCreateCoupon}
            credit_balance={credit_balance}
            onGoToSection={handleGoToSection}
          />
        )}
      </SectionContainer>
    </ContentWrapper>
  );
};
