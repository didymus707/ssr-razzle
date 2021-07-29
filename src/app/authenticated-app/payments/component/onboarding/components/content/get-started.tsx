import React, { useState } from 'react';
import { Box, Icon, Select, useToast } from '@chakra-ui/core';
import { OnboardingStage } from '../../../../payments.types';
import { useFormik } from 'formik';
import { ToastBox, Button } from 'app/components';

interface Props {
  stage: OnboardingStage;
  setStage: Function;
  updatePaymentSetup: Function;
  data: InitialValueProps;
}

interface InitialValueProps {
  country: string;
  business_type: string;
}

export const GetStarted = (props: Props) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const toast = useToast();

  const handleProceed = async (values: InitialValueProps) => {
    setUpdateLoading(true);
    const res = await props.updatePaymentSetup({ ...values, status: 'pending' });
    setUpdateLoading(false);
    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to update payment setup, please try again" />
        ),
      });
      return;
    }
    props.setStage('id-information');
  };

  const formik = useFormik({
    initialValues: {
      country: props.data.country,
      business_type: props.data.business_type,
    },
    onSubmit: handleProceed,
  });

  const { values } = formik;

  return (
    <div>
      <div className="heading">
        <div className="title">Setup your Simpu payments account</div>
        <div className="subtitle">Basic information on your business and use</div>
      </div>

      <div className="form-section">
        <div className="row">
          <div className="field-item">
            <div className="label">Country</div>
            <Select name="country" value={values.country} onChange={formik.handleChange}>
              <option value="Nigeria">Nigeria</option>
            </Select>
          </div>
        </div>

        <div className="row">
          <div className="field-item">
            <div className="label">Business Type</div>
            <Select
              name="business_type"
              value={values.business_type}
              onChange={formik.handleChange}
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </Select>
          </div>
        </div>

        <Box className="financial-container" padding="20px 30px !important">
          <div className="info-container">
            <Icon name="info" marginRight="15px" size="26px" />
            <Box>
              Please note that your choice of business type determines the account name that will be
              assigned to your Simpu Benefits bank account which would be provisioned on your behalf
            </Box>
          </div>
        </Box>
      </div>

      <div className="action-section">
        <Button variantColor="blue" onClick={formik.handleSubmit} isLoading={updateLoading}>
          Next
        </Button>
      </div>
    </div>
  );
};
