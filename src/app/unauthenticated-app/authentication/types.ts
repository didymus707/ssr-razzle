import { RouteComponentProps } from 'react-router-dom'

export type AuthProps<T> = RouteComponentProps & {
  isLoading?: boolean
  onSubmit: (values: T) => void
}
