import { ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { plannerConnector } from './planner.connector';

type PropsWithRedux = ConnectedProps<typeof plannerConnector>;
export type PlannerProps = PropsWithRedux & RouteComponentProps<{ type?: string }>;
