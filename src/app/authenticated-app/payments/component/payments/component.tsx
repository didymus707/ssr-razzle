import React from 'react';
import { ContentWrapper } from '../../../../components';
import { Wrapper } from './component.styles';
import { PaymentsSidebar } from './component.sidebar';
import { PaymentsContent } from './component.content';

export const PaymentsComponent = (props: any) => {
  const { requestCreateManagedAccount, validateCreateManagedAccount, match } = props;

  return (
    <ContentWrapper paddingBottom="2rem">
      <Wrapper>
        <PaymentsSidebar />
        <PaymentsContent
          match={match}
          requestCreateManagedAccount={requestCreateManagedAccount}
          validateCreateManagedAccount={validateCreateManagedAccount}
        />
      </Wrapper>
    </ContentWrapper>
  );
};
