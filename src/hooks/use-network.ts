import * as React from 'react'

export function useNetwork () {
  const [isOnline, setNetwork] = React.useState<boolean>(
    window.navigator.onLine
  )

  const updateNetwork = () => {
    setNetwork(window.navigator.onLine)
  }

  React.useEffect(() => {
    window.addEventListener('offline', updateNetwork)
    window.addEventListener('online', updateNetwork)
    return () => {
      window.removeEventListener('offline', updateNetwork)
      window.removeEventListener('online', updateNetwork)
    }
  })
  return isOnline
}
