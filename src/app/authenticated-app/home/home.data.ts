import { HomeProps } from './home.types';

export const onboardingTaskData = ({
  teams,
  tables,
  channels,
  campaigns,
}: Partial<Pick<HomeProps, 'teams' | 'tables'>> & { channels: any; campaigns: any }) => [
  {
    name: 'Create your account',
    desc: '',
    isCompleted: true,
  },
  {
    name: 'Create list/ Import data',
    desc: 'Bring your contacts, companies, and deals over to Simpu in one go',
    buttonLabel: 'Start',
    isCompleted: !!(tables && tables.length),
  },
  {
    url: '/s/inbox/settings/channels',
    name: 'Setup Communication channels',
    desc: 'Connect channels to conversations. Never miss customer messages ever again!',
    buttonLabel: 'Setup',
    isCompleted: !!(channels && channels.length),
  },
  {
    url: '/s/settings/organization/teams',
    name: 'Invite your team',
    desc: 'Bring every member of your team. The more, the merrier! ',
    buttonLabel: 'Invite',
    isCompleted: !!(teams && teams.length),
  },
  {
    url: '/s/marketing/campaigns',
    name: 'Plan a SMS campaign',
    desc: 'Run A/B tests campaigns, test all your assumptions.',
    buttonLabel: 'Plan',
    isCompleted: !!(campaigns && campaigns.length),
  },
];
