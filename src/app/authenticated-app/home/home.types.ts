import { ConnectedProps } from 'react-redux'
import { connector } from './home.container'
import { RouteComponentProps } from 'react-router-dom'

export interface TaskListItem {
  name: string
  desc?: string
  link?: string
  url: string
  buttonLabel?: string
  isCompleted: boolean
}

type PropsFromRedux = ConnectedProps<typeof connector>
export type HomeProps = RouteComponentProps & PropsFromRedux
