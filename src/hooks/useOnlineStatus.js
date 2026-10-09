import { useEffect, useState } from 'react'

function getOnlineStatus() {
  return typeof navigator === 'undefined' || navigator.onLine
}

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(getOnlineStatus)

  useEffect(() => {
    const setOnline = () => setIsOnline(true)
    const setOffline = () => setIsOnline(false)

    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    return () => {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
    }
  }, [])

  return isOnline
}
