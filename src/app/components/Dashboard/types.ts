import React from 'react';
import { TablePropertiesOptions } from '../../authenticated-app/tables';
import { UserProfile, User, OnboardingTasksInfo } from '../../unauthenticated-app/authentication';
import { Organization } from '../../authenticated-app/settings/settings.types';

export type DashboardProps = {
  onLogout?(): void;
  children?: React.ReactNode;
  profile?: UserProfile | null;
  user?: User | null;
  tables?: TablePropertiesOptions[];
  organizations: Organization[];
  unReadThreadCount?: number;
  onboarding_task_info: OnboardingTasksInfo;
};

export type DashboardLinks = {
  url: string;
  icon: string;
  label: string;
};

export type OrganizationPickerProps = {
  organizations: Organization[];
};
