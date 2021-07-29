import { ConnectedProps } from 'react-redux'
import { connector } from '.'

type PropsFromRedux = ConnectedProps<typeof connector>

export type Props = PropsFromRedux & { children: React.ReactNode }
