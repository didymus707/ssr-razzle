// @ts-nocheck
import { Avatar, Icon, Modal, ModalOverlay, SlideIn, useDisclosure } from '@chakra-ui/core';
import React from 'react';
import { DashboardSideSheetWrapper as Wrapper } from './dashboard.sidesheet.styles';
import { useHistory } from 'react-router-dom';
import { User, UserProfile, OnboardingTasksInfo } from '../../unauthenticated-app/authentication';
import { ConfirmModal } from '../ConfirmModal';
import { Organization } from '../../authenticated-app/settings/settings.types';
import { OrganizationPicker } from './components';

type ActionItemProps = {
  icon: string;
  label: string;
  onClick?(): void;
};

type SetupItemProps = {
  isCompleted: boolean;
  label: string;
  onClick?(): void;
};

type Props = {
  close?(): void;
  logout?(): void;
  isOpen: boolean;
  user?: User | null;
  profile?: UserProfile | null;
  onboarding_task_info: OnboardingTasksInfo;
  organizations: Organization[];
};

const ActionItem = (props: ActionItemProps) => (
  <div className="item" onClick={props.onClick}>
    <Icon name={props.icon} color="#BDBDBD" size="16px" marginRight="10px" />
    <div className="label">{props.label}</div>
  </div>
);

const SetupItem = (props: SetupItemProps) => (
  <div className={`item ${props.isCompleted && 'done'} `}>
    <div className="name-section" onClick={props.onClick}>
      <Icon
        name={`${props.isCompleted ? 'check-circle' : 'radio'}`}
        size="16px"
        marginRight="10px"
      />
      <div className="name">{props.label}</div>
    </div>
    <div className="duration">{props.duration}</div>
  </div>
);

export const DashboardSideSheet = (props: Props) => {
  const { close, isOpen, profile, user, logout, onboarding_task_info } = props;

  const {
    isOpen: isLogoutDialogOpen,
    onClose: closeLogoutDialog,
    onOpen: openLogoutDialog,
  } = useDisclosure();

  const router_history = useHistory();

  const nav = (url: string) => {
    router_history.push(url);
    close();
  };

  const show_onboarding = Object.values(onboarding_task_info).some((i: boolean) => !i);

  const organizations = [...props.organizations].sort(a =>
    a.id === profile.organisation_id ? -1 : 1,
  );

  return (
    <>
      <SlideIn in={isOpen}>
        {(styles: Object) => (
          <Modal isOpen={true} onClose={close}>
            <ModalOverlay />
            <Wrapper {...styles}>
              <div className="profile-info">
                <Avatar
                  name={`${profile?.first_name} ${profile?.last_name}`}
                  size="md"
                  color="white"
                />
                <div className="text-section">
                  <div className="name">
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div className="email">{user?.email}</div>
                </div>
              </div>
              <hr />

              <OrganizationPicker organizations={organizations} />
              <hr />

              {show_onboarding && (
                <>
                  <div className="pending-setup">
                    <div className="title">Get the most out of your account</div>
                    <SetupItem
                      label="Create your account"
                      duration="About 60 seconds"
                      isCompleted
                    />
                    <SetupItem
                      label="Create a list/import data"
                      duration="About 30 seconds"
                      onClick={() => nav('/s/lists')}
                      isCompleted={onboarding_task_info['lists']}
                    />
                    <SetupItem
                      label="Setup a communication channel"
                      duration="About 5 minutes"
                      onClick={() => nav('/s/inbox/settings/channels')}
                      isCompleted={onboarding_task_info['channels']}
                    />
                    <SetupItem
                      label="Invite your team"
                      duration="About 5 minutes"
                      onClick={() => nav('/s/settings/organization/teams')}
                      isCompleted={onboarding_task_info['teams']}
                    />
                    <SetupItem
                      label="Plan an SMS campaign"
                      duration="About 2 minutes"
                      onClick={() => nav('/s/marketing/campaigns')}
                      isCompleted={onboarding_task_info['campaigns']}
                    />
                  </div>
                  <hr />
                </>
              )}

              <div className="section-actions">
                <ActionItem
                  icon="personal"
                  label="My Settings"
                  onClick={() => nav('/s/settings/me/profile')}
                />
                <ActionItem
                  icon="settings"
                  label="Organization Settings"
                  onClick={() => nav('/s/settings/organization')}
                />
                <ActionItem
                  icon="external-link"
                  label="Sign Out"
                  onClick={() => {
                    openLogoutDialog();
                    close();
                  }}
                />
              </div>
            </Wrapper>
          </Modal>
        )}
      </SlideIn>
      <ConfirmModal
        isOpen={isLogoutDialogOpen}
        onClose={() => {
          closeLogoutDialog();
        }}
        title="Logout confirmation"
        onConfirm={() => {
          logout();
          closeLogoutDialog();
        }}
      />
    </>
  );
};
