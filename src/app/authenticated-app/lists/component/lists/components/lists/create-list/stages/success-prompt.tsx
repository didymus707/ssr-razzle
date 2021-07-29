import React from 'react';
import { EmptyState, Button } from 'app/components';
import importSuccess from '../../../../../../assets/success.svg';

interface Props {
  proceed: () => void;
}

export const CreateListImportSuccessPrompt = (props: Props) => {
  return (
    <EmptyState
      image={importSuccess}
      paddingY="25px"
      heading="Import queued successfully"
      subheading="We've created a list and started processing your import, and all your data
         would be available once processing has been completed."
      children={
        <Button variantColor="green" size="sm" onClick={props.proceed}>
          View list
        </Button>
      }
    />
  );
};
