import React, { useState } from 'react';
import { Box, Icon, Select, Spinner, useToast } from '@chakra-ui/core';
import { OnboardingStage, UploadedFile } from '../../../../payments.types';
import { industry_options } from '../../../../payments.data';
import { useFormik } from 'formik';
import { FileSelectButton, ToastBox, Button, Input } from 'app/components';

interface Props {
  stage: OnboardingStage;
  setStage: Function;
  updatePaymentSetup: Function;
  data: InitialValueProps;
}

interface InitialValueProps {
  industry: string;
  website: string;
  phone: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  bn_number: string;
  business_type: string;
  bn_doc?: UploadedFile;
  cac_doc?: UploadedFile;
}

export const BusinessDetails = (props: Props) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [fileUploadLoading, setFileUploadLoading] = useState<string | null>(null);

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
    props.setStage('summary');
  };

  const handleBack = () => {
    props.setStage('account-owner');
  };

  const formik = useFormik({
    initialValues: {
      industry: props.data.industry || '',
      website: props.data.website || '',
      phone: props.data.phone || '',
      email: props.data.email || '',
      facebook: props.data.facebook || '',
      twitter: props.data.twitter || '',
      instagram: props.data.instagram || '',
      linkedin: props.data.linkedin || '',
      bn_number: props.data.bn_number || '',
      business_type: props.data.business_type,
    },
    onSubmit: handleProceed,
  });

  const { values } = formik;

  const handleFileUpload = async (event: any) => {
    const payload_key = event.target.name;
    setFileUploadLoading(payload_key);
    const file = event.target.files[0];
    const res = await props.updatePaymentSetup({ [payload_key]: file, status: 'pending' });
    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to upload your file, please try that again" />
        ),
      });
    }
    setFileUploadLoading(null);
  };

  return (
    <div>
      <div className="heading">
        <div className="title">Business Details</div>
      </div>

      <div className="form-section">
        <Box className="row">
          <Box className="field-item">
            <div className="label">Industry</div>
            <Select name="industry" value={values.industry} onChange={formik.handleChange}>
              {industry_options.map((i: string, index: number) => (
                <option key={index} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Box>
        </Box>

        <Box className="row">
          <Box className="field-item">
            <div className="label">Business Website</div>
            <Input name="website" value={values.website} onChange={formik.handleChange} />
          </Box>
        </Box>

        <div className="row">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Phone Number</div>
            <Input name="phone" value={values.phone} onChange={formik.handleChange} />
          </Box>

          <Box className="field-item" paddingLeft="5px">
            <div className="label">Email Address</div>
            <Input name="email" value={values.email} onChange={formik.handleChange} />
          </Box>
        </div>

        <div className="row">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Facebook</div>
            <Input name="facebook" value={values.facebook} onChange={formik.handleChange} />
          </Box>

          <Box className="field-item" paddingLeft="5px">
            <div className="label">Instagram</div>
            <Input name="instagram" value={values.instagram} onChange={formik.handleChange} />
          </Box>
        </div>

        <div className="row">
          <Box className="field-item" paddingRight="5px">
            <div className="label">Twitter</div>
            <Input name="twitter" value={values.twitter} onChange={formik.handleChange} />
          </Box>

          <Box className="field-item" paddingLeft="5px">
            <div className="label">LinkedIn</div>
            <Input name="linkedin" value={values.linkedin} onChange={formik.handleChange} />
          </Box>
        </div>

        {props.data.business_type === 'company' && (
          <div className="financial-container">
            <Box className="row" width="50%">
              <Box className="field-item" paddingRight="5px">
                <div className="label">BN Number</div>
                <Input name="bn_number" value={values.bn_number} onChange={formik.handleChange} />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field-item">
                <div className="label">BN document upload</div>
                <Box display="flex">
                  <FileSelectButton name="bn_doc" onChange={handleFileUpload} accept="image/*" />
                  {props.data.bn_doc && (
                    <Box
                      ml="20px"
                      textDecoration="underline"
                      color="blue.500"
                      cursor="pointer"
                      onClick={() => window.open(props.data.bn_doc?.src, '_blank')}
                    >
                      {props.data.bn_doc.fileName}
                    </Box>
                  )}
                </Box>
              </Box>
              {fileUploadLoading === 'bn_doc' && <Spinner alignSelf="flex-end" marginY="10px" />}
            </Box>

            <Box className="row">
              <Box className="field-item">
                <div className="label">CAC document upload</div>
                <Box display="flex">
                  <FileSelectButton name="cac_doc" onChange={handleFileUpload} accept="image/*" />
                  {props.data.cac_doc && (
                    <Box
                      ml="20px"
                      textDecoration="underline"
                      color="blue.500"
                      cursor="pointer"
                      onClick={() => window.open(props.data.cac_doc?.src, '_blank')}
                    >
                      {props.data.cac_doc.fileName}
                    </Box>
                  )}
                </Box>
              </Box>
              {fileUploadLoading === 'cac_doc' && <Spinner alignSelf="flex-end" marginY="10px" />}
            </Box>

            <div className="info-container">
              <Icon name="info" marginRight="15px" size="26px" />
              <Box>
                This information is required by our regulators and financial partners. It is
                completely secure and confidential.
              </Box>
            </div>
          </div>
        )}
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
