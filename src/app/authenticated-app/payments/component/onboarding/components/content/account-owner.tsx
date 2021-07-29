import React, { useState } from 'react';
import { Select, useToast } from '@chakra-ui/core';
import { OnboardingStage, UploadedFile } from '../../../../payments.types';
import { Box, Input } from '@chakra-ui/core/dist';
import { useFormik } from 'formik';
import { ToastBox, Button } from 'app/components';
import { DateFieldComponent } from '../../../../../lists/components/cell-properties';
import { title_options, gender_options, nigerian_state_options } from '../../../../payments.data';

interface Props {
  stage: OnboardingStage;
  setStage: Function;
  updatePaymentSetup: Function;
  data: InitialValueProps;
}

interface InitialValueProps {
  owner_first_name: string;
  owner_last_name: string;
  owner_title: string;
  owner_gender: string;
  owner_job_title: string;
  owner_home_address_street: string;
  owner_home_address_apartment: string;
  owner_home_address_city: string;
  owner_home_address_state: string;
  owner_phone: string;
  owner_email: string;
  owner_bvn: string;
  owner_nin: string;
  owner_passport_number: string;
  owner_voters_card_number: string;
  owner_drivers_license_number: string;
  owner_dob: string;
  owner_id_type: string;
  owner_nin_doc?: UploadedFile;
  owner_passport_doc?: UploadedFile;
  owner_drivers_license_doc?: UploadedFile;
  owner_voters_card_doc?: UploadedFile;
}

export const AccountOwner = (props: Props) => {
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
    props.setStage('business-details');
  };
  const handleBack = () => {
    props.setStage('id-information');
  };

  const formik = useFormik({
    initialValues: {
      owner_first_name: props.data.owner_first_name || '',
      owner_last_name: props.data.owner_last_name || '',
      owner_title: props.data.owner_title || '',
      owner_gender: props.data.owner_gender || '',
      owner_job_title: props.data.owner_job_title || '',
      owner_home_address_street: props.data.owner_home_address_street || '',
      owner_home_address_apartment: props.data.owner_home_address_apartment || '',
      owner_home_address_city: props.data.owner_home_address_city || '',
      owner_home_address_state: props.data.owner_home_address_state || '',
      owner_phone: props.data.owner_phone || '',
      owner_email: props.data.owner_email || '',
      owner_dob: props.data.owner_dob || '',
      owner_id_type: props.data.owner_id_type,
      owner_nin: props.data.owner_nin || '',
      owner_passport_number: props.data.owner_passport_number || '',
      owner_voters_card_number: props.data.owner_voters_card_number || '',
      owner_drivers_license_number: props.data.owner_voters_card_number || '',
      owner_bvn: props.data.owner_bvn || '',
    },
    onSubmit: handleProceed,
  });

  const { values } = formik;

  return (
    <div>
      <div className="heading">
        <div className="title">Account Owner</div>
        <div className="subtitle">Please add you personal information to create an account</div>
      </div>

      <div className="form-section">
        <div className="row">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Owner Legal First Name</div>
            <Input
              name="owner_first_name"
              value={values.owner_first_name}
              onChange={formik.handleChange}
            />
          </Box>

          <Box className="field-item" paddingLeft="5px">
            <div className="label">Owner Legal Last Name</div>
            <Input
              name="owner_last_name"
              value={values.owner_last_name}
              onChange={formik.handleChange}
            />
          </Box>
        </div>

        <div className="row">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Owner Title</div>
            <Select name="owner_title" value={values.owner_title} onChange={formik.handleChange}>
              {title_options.map((i: any, index: number) => (
                <option key={index} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Box>

          <Box className="field-item" paddingLeft="5px">
            <div className="label">Owner Gender</div>
            <Select name="owner_gender" value={values.owner_gender} onChange={formik.handleChange}>
              {gender_options.map((i: any, index: number) => (
                <option key={index} value={i.value}>
                  {i.label}
                </option>
              ))}
            </Select>
          </Box>
        </div>

        <Box className="row" width="50%">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Job Title</div>
            <Input
              name="owner_job_title"
              value={values.owner_job_title}
              onChange={formik.handleChange}
            />
          </Box>
        </Box>

        <Box className="row">
          <Box className="field-item" width="74.5% !important">
            <div className="label">Home Street Address</div>
            <Input
              name="owner_home_address_street"
              value={values.owner_home_address_street}
              onChange={formik.handleChange}
            />
          </Box>
          <Box className="field-item" width="24% !important">
            <div className="label">Apt/Unit</div>
            <Input
              name="owner_home_address_apartment"
              value={values.owner_home_address_apartment}
              onChange={formik.handleChange}
            />
          </Box>
        </Box>

        <Box className="row">
          <Box className="field-item" paddingRight="5px">
            <div className="label">City</div>
            <Input
              name="owner_home_address_city"
              value={values.owner_home_address_city}
              onChange={formik.handleChange}
            />
          </Box>
          <Box className="field-item" paddingLeft="5px">
            <div className="label">State</div>
            <Select
              name="owner_home_address_state"
              value={values.owner_home_address_state}
              onChange={formik.handleChange}
            >
              {nigerian_state_options.map((i: string, index: number) => (
                <option key={index} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Box>
        </Box>

        <Box className="row" width="50%">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Home Phone Number</div>
            <Input name="owner_phone" value={values.owner_phone} onChange={formik.handleChange} />
          </Box>
        </Box>

        <Box className="row" width="50%">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Email Address</div>
            <Input name="owner_email" value={values.owner_email} onChange={formik.handleChange} />
          </Box>
        </Box>

        <Box className="row" width="50%">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Date of Birth</div>
            <DateFieldComponent
              value={values.owner_dob}
              column={{}}
              updateCellValue={(value: string) => formik.setFieldValue('owner_dob', value)}
            />
          </Box>
        </Box>
      </div>

      <div className="action-section">
        <Button onClick={handleBack}>Back</Button>
        <Button
          marginLeft="10px"
          variantColor="blue"
          isLoading={updateLoading}
          onClick={formik.handleSubmit}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
