import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { ErrorPage } from '../ErrorPage';

interface State {
  hasError?: boolean;
  info?: object | null;
  eventId?: string;
}

export class ErrorBoundary extends React.Component<{}, State> {
  state: State = { hasError: false, info: null };

  componentDidCatch(error: Error | null, info: object) {
    this.setState({ hasError: true, info });
    const i = info as Record<string, unknown>;

    Sentry.withScope(scope => {
      scope.setExtras(i);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
