import { RouteComponentProps } from 'react-router-dom'
import { User, UserProfile } from '../../unauthenticated-app/authentication'

export interface OnboardStepProps {
  user: User | null
  notNow?: () => void
  nextStep?: () => void
  profile?: UserProfile | null
  openCreateTableModal?(): void
  history?: RouteComponentProps['history']
}
