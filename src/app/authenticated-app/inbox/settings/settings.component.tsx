import { Stack } from '@chakra-ui/core';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { InboxSettingsChannels } from './Channels';
import { InboxSettingsPanel, InboxSettingsSidebar, InboxSettingsSidebarLink } from './component';
import { InboxSettingsTags } from './Tags';
import { InboxSettingsRules } from './Rules';
import { InboxSettingsQuickReplies } from './QuickReplies';
import { InboxSettingsSignatures } from './Signatures';
import { InboxSettingsChannelPreview } from './ChannelPreview';
import { InboxSettingsNewTag } from './NewTag';
import { InboxSettingsEditTag } from './EditTag';
import { InboxSettingsNewQuickReply } from './NewQuickReply';
import { InboxSettingsEditQuickReply } from './EditQuickReply';
import { InboxSettingsNewSignature } from './NewSignature';
import { InboxSettingsEditSignature } from './EditSignature';
import { InboxSettingsConnections } from './Connections';

export const InboxSettings = () => {
  const match = useRouteMatch();
  const history = useHistory();

  return (
    <Stack isInline height="100vh">
      <InboxSettingsSidebar onClose={() => history.push('/s/inbox')}>
        <Stack height="100%">
          <InboxSettingsSidebarLink icon="inbox-channels" to={`${match.url}/channels`}>
            Channels
          </InboxSettingsSidebarLink>
          <InboxSettingsSidebarLink icon="inbox-connections" to={`${match.url}/connections`}>
            Connections
          </InboxSettingsSidebarLink>
          <InboxSettingsSidebarLink icon="inbox-rules" to={`${match.url}/rules`}>
            Rules
          </InboxSettingsSidebarLink>
          <InboxSettingsSidebarLink icon="inbox-compose-quote" to={`${match.url}/quick-replies`}>
            Quick Replies
          </InboxSettingsSidebarLink>
          <InboxSettingsSidebarLink icon="inbox-signature" to={`${match.url}/signatures`}>
            Signatures
          </InboxSettingsSidebarLink>
          <InboxSettingsSidebarLink icon="inbox-tag" to={`${match.url}/tags`}>
            Tags
          </InboxSettingsSidebarLink>
        </Stack>
      </InboxSettingsSidebar>
      <InboxSettingsPanel>
        <Switch>
          <Route exact path={`${match.path}/channels`} render={() => <InboxSettingsChannels />} />
          <Route
            exact
            path={`${match.path}/channels/:channel`}
            render={() => <InboxSettingsChannelPreview />}
          />
          <Route
            exact
            path={`${match.path}/channels/:channel/:id`}
            render={() => <InboxSettingsChannelPreview />}
          />
          <Route exact path={`${match.path}/tags/new`} render={() => <InboxSettingsNewTag />} />
          <Route exact path={`${match.path}/tags/:id`} render={() => <InboxSettingsEditTag />} />
          <Route path={`${match.path}/tags`} render={() => <InboxSettingsTags />} />
          <Route path={`${match.path}/rules`} render={() => <InboxSettingsRules />} />
          <Route
            exact
            path={`${match.path}/connections`}
            render={() => <InboxSettingsConnections />}
          />
          <Route
            exact
            path={`${match.path}/quick-replies/new`}
            render={() => <InboxSettingsNewQuickReply />}
          />
          <Route
            exact
            path={`${match.path}/quick-replies/:id`}
            render={() => <InboxSettingsEditQuickReply />}
          />
          <Route
            path={`${match.path}/quick-replies`}
            render={() => <InboxSettingsQuickReplies />}
          />
          <Route
            exact
            path={`${match.path}/signatures/new`}
            render={() => <InboxSettingsNewSignature />}
          />
          <Route
            exact
            path={`${match.path}/signatures/:id`}
            render={() => <InboxSettingsEditSignature />}
          />
          <Route path={`${match.path}/signatures`} render={() => <InboxSettingsSignatures />} />
        </Switch>
      </InboxSettingsPanel>
    </Stack>
  );
};
