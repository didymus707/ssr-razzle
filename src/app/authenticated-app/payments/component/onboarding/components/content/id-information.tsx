import React, { useState } from 'react';
import { Icon, Select, Spinner, useToast } from '@chakra-ui/core';
import { OnboardingStage, UploadedFile } from '../../../../payments.types';
import { Box, Input } from '@chakra-ui/core/dist';
import { useFormik } from 'formik';
import { FileSelectButton, ToastBox, Button } from 'app/components';

interface Props {
  stage: OnboardingStage;
  setStage: Function;
  updatePaymentSetup: Function;
  data: InitialValueProps;
}

interface InitialValueProps {
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

export const IDInformation = (props: Props) => {
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
    props.setStage('account-owner');
  };

  const handleBack = () => {
    props.setStage('get-started');
  };

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

  const formik = useFormik({
    initialValues: {
      owner_dob: props.data.owner_dob || '',
      owner_id_type: props.data.owner_id_type,
      owner_nin: props.data.owner_nin || '',
      owner_bvn: props.data.owner_bvn || '',
      owner_passport_number: props.data.owner_passport_number || '',
      owner_voters_card_number: props.data.owner_voters_card_number || '',
      owner_drivers_license_number: props.data.owner_voters_card_number || '',
    },
    onSubmit: handleProceed,
  });

  const { values } = formik;

  return (
    <>
      <Box>
        <div className="heading">
          <div className="title">Identification Information</div>
          <div className="subtitle">
            Please add the following information so we can verify your identity
          </div>
        </div>

        <div className="form-section">
          <div className="financial-container">
            <Box className="row" width="50%">
              <Box className="field-item">
                <div className="label">Bank Verification Number (BVN)</div>
                <Input name="owner_bvn" value={values.owner_bvn} onChange={formik.handleChange} />
              </Box>
            </Box>

            <Box className="row" width="50%">
              <Box className="field-item">
                <div className="label">Identification Type</div>
                <Select
                  name="owner_id_type"
                  value={values.owner_id_type}
                  onChange={formik.handleChange}
                >
                  <option value="nin">National ID (NIN)</option>
                  <option value="passport">International Passport</option>
                  <option value="drivers-license">Drivers License</option>
                  <option value="voters-card">Voters Card</option>
                </Select>
              </Box>
            </Box>

            <Box className="row" width="50%">
              <Box className="field-item">
                {values.owner_id_type === 'nin' && (
                  <>
                    <div className="label">National Identification Number</div>
                    <Input
                      name="owner_nin"
                      value={values.owner_nin}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
                {values.owner_id_type === 'passport' && (
                  <>
                    <div className="label">International Passport Number</div>
                    <Input
                      name="owner_passport_number"
                      value={values.owner_passport_number}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
                {values.owner_id_type === 'drivers-license' && (
                  <>
                    <div className="label">Drivers License Number</div>
                    <Input
                      name="owner_drivers_license_number"
                      value={values.owner_drivers_license_number}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
                {values.owner_id_type === 'voters-card' && (
                  <>
                    <div className="label">Voters Card Number</div>
                    <Input
                      name="owner_voters_card_number"
                      value={values.owner_voters_card_number}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </Box>
            </Box>

            <Box className="row">
              <Box className="field-item">
                {values.owner_id_type === 'nin' && (
                  <>
                    <div className="label">NIN Slip upload</div>
                    <Box display="flex">
                      <FileSelectButton
                        name="owner_nin_doc"
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                      {props.data.owner_nin_doc && (
                        <Box
                          ml="20px"
                          textDecoration="underline"
                          color="blue.500"
                          cursor="pointer"
                          onClick={() => window.open(props.data.owner_nin_doc?.src, '_blank')}
                        >
                          {props.data.owner_nin_doc.fileName}
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                {values.owner_id_type === 'passport' && (
                  <>
                    <div className="label">International Passport upload</div>
                    <Box display="flex">
                      <FileSelectButton
                        name="owner_passport_doc"
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                      {props.data.owner_passport_doc && (
                        <Box
                          ml="20px"
                          textDecoration="underline"
                          color="blue.500"
                          cursor="pointer"
                          onClick={() => window.open(props.data.owner_passport_doc?.src, '_blank')}
                        >
                          {props.data.owner_passport_doc.fileName}
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                {values.owner_id_type === 'drivers-license' && (
                  <>
                    <div className="label">Drivers License upload</div>

                    <Box display="flex">
                      <FileSelectButton
                        name="owner_drivers_license_doc"
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                      {props.data.owner_drivers_license_doc && (
                        <Box
                          ml="20px"
                          textDecoration="underline"
                          color="blue.500"
                          cursor="pointer"
                          onClick={() =>
                            window.open(props.data.owner_drivers_license_doc?.src, '_blank')
                          }
                        >
                          {props.data.owner_drivers_license_doc.fileName}
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                {values.owner_id_type === 'voters-card' && (
                  <>
                    <div className="label">Voters Card upload</div>
                    <Box display="flex">
                      <FileSelectButton
                        name="owner_voters_card_doc"
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                      {props.data.owner_voters_card_doc && (
                        <Box
                          ml="20px"
                          textDecoration="underline"
                          color="blue.500"
                          cursor="pointer"
                          onClick={() =>
                            window.open(props.data.owner_voters_card_doc?.src, '_blank')
                          }
                        >
                          {props.data.owner_voters_card_doc.fileName}
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Box>
              {!!fileUploadLoading && <Spinner alignSelf="flex-end" marginY="10px" />}
            </Box>

            <div className="info-container">
              <Icon name="info" marginRight="15px" size="26px" />
              <Box>
                This information is required by our regulators and financial partners. It is
                completely secure and confidential.
              </Box>
            </div>
          </div>
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
      </Box>
    </>
  );
};
