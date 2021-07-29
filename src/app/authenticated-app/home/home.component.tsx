import { Box } from '@chakra-ui/core';
import Cookie from 'js-cookie';
import * as React from 'react';
import { useQueryClient } from 'react-query';
import { ContentWrapper } from '../../components';
import { ContactInfoCard, OnboardingTaskList, WelcomeModal } from './components';
import { onboardingTaskData } from './home.data';
import { HomeProps, TaskListItem } from './home.types';

export function HomeComponent(props: HomeProps) {
  const { tables, teams, user } = props;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();

  const campaigns: any = queryClient.getQueryData('campaigns');
  const channels = queryClient.getQueryData('channels');

  React.useEffect(() => {
    const pristine = !Cookie.get('touched');
    if (!user?.last_login && pristine) setIsOpen(true);
  }, [user]);

  const taskList = onboardingTaskData({
    teams,
    tables,
    channels,
    campaigns: campaigns?.data?.campaigns,
  }) as TaskListItem[];

  const closeModal = () => {
    Cookie.set('touched', 'true');
    setIsOpen(false);
  };

  return (
    <>
      <ContentWrapper>
        <Box padding="4rem 1rem">
          <ContactInfoCard />
          <OnboardingTaskList taskList={taskList} />
          <WelcomeModal isOpen={isOpen} onClose={closeModal} />
        </Box>
      </ContentWrapper>
    </>
  );
}
