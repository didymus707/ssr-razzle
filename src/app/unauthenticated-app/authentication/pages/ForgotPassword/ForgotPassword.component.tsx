import * as React from "react";
import { AuthLayout } from "../../components/layout";
import {
  ForgotPasswordForm,
  ForgotPasswordInitialValuesProps,
} from "../../components/forms";
import { AuthProps } from "../../types";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Text,
} from "@chakra-ui/core";
import { Link } from "react-router-dom";

export function ForgotPassword(
  props: AuthProps<ForgotPasswordInitialValuesProps> & {
    isSuccess: boolean;
    closeAlert(): void;
  }
) {
  const { onSubmit, isSuccess, isLoading, closeAlert } = props;

  return (
    <AuthLayout
      subheading="Enter the email address associated with your account and we'll send you a link to reset your password"
      footing={
        <Text>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2034c5" }}>
            Sign up
          </Link>
        </Text>
      }
    >
      {isSuccess && (
        <Alert status="success" marginBottom="2rem">
          <AlertIcon />
          <AlertDescription>
            An email with a link to reset your password has been sent to you.
          </AlertDescription>
          <CloseButton
            onClick={closeAlert}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      )}
      <ForgotPasswordForm
        isLoading={isLoading}
        onSubmit={(values) => onSubmit(values)}
      />
    </AuthLayout>
  );
}
