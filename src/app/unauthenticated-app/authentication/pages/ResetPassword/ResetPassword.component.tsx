import * as React from "react";
import {
  ResetPasswordForm,
  ResetPasswordFormInitialValuesProps,
} from "../../components/forms";
import { AuthLayout } from "../../components/layout";
import { AuthProps } from "../../types";
import { useEffect } from "react";

export function ResetPassword(
  props: AuthProps<ResetPasswordFormInitialValuesProps>
) {
  const { onSubmit, isLoading } = props;

  useEffect(() => {
    document.title = "Simpu: Password Reset";
  }, []);

  return (
    <AuthLayout
      heading="Reset your password"
      subheading="Fill in your new password below."
    >
      <ResetPasswordForm
        isLoading={isLoading}
        onSubmit={(values) => onSubmit(values)}
      />
    </AuthLayout>
  );
}
