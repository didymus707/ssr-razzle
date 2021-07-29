import React, { useRef, useState } from 'react';
import { Box, useToast, Icon } from '@chakra-ui/core';
import { OnboardingStage } from '../../../../payments.types';
import { capitalize } from 'lodash';
import moment from 'moment';
import { ToastBox, Button } from 'app/components';

interface Props {
  stage: OnboardingStage;
  setStage: Function;
  data: { [key: string]: any };
  updatePaymentSetup: Function;
}

export const Summary = (props: Props) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const containerRef = useRef();

  const handleBack = () => {
    props.setStage('business-details');
  };

  const toast = useToast();

  const handleProceed = async () => {
    setUpdateLoading(true);
    const res = await props.updatePaymentSetup({ status: 'submitted' });
    setUpdateLoading(false);
    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to submit payment setup, please try again" />
        ),
      });
    } else {
      // @ts-ignore
      containerRef.current.parentElement.scrollTo({
        top: 1000000,
        behavior: 'auto',
      });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Payment setup submitted for review successfully"
          />
        ),
      });
    }
  };

  const { data } = props;

  return (
    <Box ref={containerRef}>
      <div className="heading">
        <div className="title">Does everything look good?</div>
        <div className="subtitle">
          Please review all information and check for possible errors before submitting for approval
        </div>
      </div>

      <div className="summary-section">
        <div className="section-title">Identification Information</div>
        <div className="section-info">
          <div className="field">
            <div className="label">Bank Verification Number (BVN)</div>
            <div className="value">{data.owner_bvn || '-'}</div>
          </div>

          <div className="field">
            <div className="label">Identification Type</div>
            <div className="value">
              {data.owner_id_type === 'nin' && 'National ID (NIN)'}
              {data.owner_id_type === 'passport' && 'International Passport'}
              {data.owner_id_type === 'drivers-license' && 'Drivers License'}
              {data.owner_id_type === 'voters-card' && 'Voters Card'}
            </div>
          </div>

          <div className="field">
            <div className="label">
              {data.owner_id_type === 'nin' && 'National Identification Number'}
              {data.owner_id_type === 'passport' && 'International Passport Number'}
              {data.owner_id_type === 'drivers-license' && 'Drivers License Number'}
              {data.owner_id_type === 'voters-card' && 'Voters Card Number'}
            </div>
            <div className="value">
              {data.owner_id_type === 'nin' && data.owner_nin}
              {data.owner_id_type === 'passport' && data.owner_passport_number}
              {data.owner_id_type === 'drivers-license' && data.owner_drivers_license_number}
              {data.owner_id_type === 'voters-card' && data.owner_voters_card_number}
            </div>
          </div>

          <div className="field">
            <div className="label">
              {data.owner_id_type === 'nin' && 'NIN Slip upload'}
              {data.owner_id_type === 'passport' && 'International Passport upload'}
              {data.owner_id_type === 'drivers-license' && 'Drivers License upload'}
              {data.owner_id_type === 'voters-card' && 'Voters Card upload'}
            </div>
            <Box
              className="value"
              color="blue.500"
              textDecoration="underline"
              cursor="pointer"
              onClick={() => {
                if (data.owner_id_type === 'nin') window.open(data.owner_nin_doc?.src, '_blank');
                if (data.owner_id_type === 'passport')
                  window.open(data.owner_passport_doc?.src, '_blank');
                if (data.owner_id_type === 'drivers-license')
                  window.open(data.owner_drivers_license_doc?.src, '_blank');
                if (data.owner_id_type === 'voters-card')
                  window.open(data.owner_voters_card_doc?.src, '_blank');
              }}
            >
              {data.owner_id_type === 'nin' && data.owner_nin_doc?.fileName}
              {data.owner_id_type === 'passport' && data.owner_passport_doc?.fileName}
              {data.owner_id_type === 'drivers-license' && data.owner_drivers_license_doc?.fileName}
              {data.owner_id_type === 'voters-card' && data.owner_voters_card_doc?.fileName}
            </Box>
          </div>
        </div>
        <Box color="blue.500" cursor="pointer" onClick={() => props.setStage('id-information')}>
          Edit
        </Box>
      </div>

      <div className="summary-section">
        <div className="section-title">Account Owner</div>
        <div className="section-info">
          <div className="field">
            <div className="label">Name</div>
            <div className="value">{`${data.owner_first_name} ${data.owner_last_name}`}</div>
          </div>
          <div className="field">
            <div className="label">Title</div>
            <div className="value">{`${data.owner_title || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Gender</div>
            <div className="value">{`${
              data.owner_gender ? capitalize(data.owner_gender) : '-'
            }`}</div>
          </div>

          <div className="field">
            <div className="label">Job Title</div>
            <div className="value">{`${data.owner_job_title || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Home Address</div>
            <div className="value">{`${data.owner_home_address_apartment} ${data.owner_home_address_street}`}</div>
          </div>

          <div className="field">
            <div className="label">City</div>
            <div className="value">{`${data.owner_home_address_city || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">State</div>
            <div className="value">{`${data.owner_home_address_state}`}</div>
          </div>

          <div className="field">
            <div className="label">Phone</div>
            <div className="value">{`${data.owner_phone || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Email</div>
            <div className="value">{`${data.owner_email || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Date of Birth</div>
            <div className="value">{`${
              data.owner_dob && moment(data.owner_dob).format('DD/MM/YYYY')
            }`}</div>
          </div>
        </div>
        <Box color="blue.500" cursor="pointer" onClick={() => props.setStage('account-owner')}>
          Edit
        </Box>
      </div>
      <div className="summary-section">
        <div className="section-title">Business Details</div>
        <div className="section-info">
          <div className="field">
            <div className="label">Industry</div>
            <div className="value">{data.industry}</div>
          </div>
          <div className="field">
            <div className="label">Business Website</div>
            <div className="value">{`${data.website || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Phone Number</div>
            <div className="value">{`${data.phone || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Email</div>
            <div className="value">{`${data.email || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">LinkedIn</div>
            <div className="value">{`${data.linkedin || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Facebook</div>
            <div className="value">{`${data.facebook || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Twitter</div>
            <div className="value">{`${data.twitter || '-'}`}</div>
          </div>

          <div className="field">
            <div className="label">Instagram</div>
            <div className="value">{data.instagram || '-'}</div>
          </div>
        </div>
        <Box color="blue.500" cursor="pointer" onClick={() => props.setStage('business-details')}>
          Edit
        </Box>
      </div>
      <div className="action-section">
        <Button onClick={handleBack}>Back</Button>
        <Button
          marginLeft="10px"
          variantColor="blue"
          onClick={handleProceed}
          isLoading={updateLoading}
          isDisabled={data.status === 'submitted' || data.approval_status === 'successful'}
        >
          Submit for approval
        </Button>
      </div>

      {data.status === 'submitted' && data.approval_status !== 'successful' && (
        <Box fontSize="14px" display="flex" flexDirection="row" mb="80px" maxW="600px">
          <Icon name="info" mr="15px" mt="5px" size="20px" />
          Your payment setup has been submitted for approval and you'll hear from us once it's
          approved. Shouldn't take more than one business day 😊.
        </Box>
      )}

      {data.approval_status === 'successful' && (
        <Box fontSize="14px" display="flex" flexDirection="row" mb="80px" maxW="600px">
          <Icon name="info" mr="15px" mt="5px" size="20px" />
          Your payment setup has been successfully reviewed and approved. You can now carry out
          transactions and request payments on Simpu 😊.
        </Box>
      )}
    </Box>
  );
};
