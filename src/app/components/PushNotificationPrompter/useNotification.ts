import { useState, useEffect } from 'react'
import { client, buildConversationUrl, loadState, saveState } from '../../../utils'

function urlBase64ToUint8Array (base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function usePushNotifications (
  userId: string,
  email: string,
  organizationID: string
) {
  const [error, setError] = useState<string | null>(null)
  const isPushNotificationSupported = 'serviceWorker' in navigator && 'PushManager' in window
  const [pushNotificationStatus, setPushNotificationStatus] = useState(Notification.permission)
  const [isSwSetUp, setIsSwSetUp] = useState(false)
  const [isSubcriptionReady, setIsSubcriptionReady] = useState(false)

  function askPushNotificationPermission () {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result)
      })

      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    }).then(permissionResult => {
      if (permissionResult !== 'granted' && error !== 'Okay! But you will not receive notification for new messages') {
        return setError('Okay! But you will not receive notification for new messages');
      }

      setPushNotificationStatus((permissionResult as any));
    })
  }

  useEffect(() => {
    if (isPushNotificationSupported && organizationID && !isSwSetUp) {
      navigator.serviceWorker.register('/sw.js').then(a => {
        setIsSwSetUp(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPushNotificationSupported, organizationID])

  useEffect(() => {
    const getExistingSubscription = async () => {
      if (
        organizationID &&
        isSwSetUp &&
        pushNotificationStatus === 'granted' &&
        !isSubcriptionReady
      ) {
        try {
          const serviceWorker = await navigator.serviceWorker?.ready
          if (serviceWorker?.active) {
            let subscription = await serviceWorker.pushManager.getSubscription()

            if (!subscription) {
              subscription = await serviceWorker.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  process.env.REACT_APP_WEB_PUSH_VAPID_PUBLIC_KEY || ''
                ),
              })
            }

            const result = await client('', {
              url: buildConversationUrl(`push-notifications/${organizationID}`),
              method: 'POST',
              data: {
                subscription,
                user_id: userId,
              },
            })

            saveState({ ...loadState(), SWID: result.data.id })
            setIsSubcriptionReady(true)
          }
        } catch (error) {
          console.error('######### - ', error)
          setIsSubcriptionReady(false)
          setError(error.message)
        }
      }
    }

    getExistingSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  return {
    error,
    isPushNotificationSupported,
    pushNotificationStatus,
    askPushNotificationPermission,
  }
}
