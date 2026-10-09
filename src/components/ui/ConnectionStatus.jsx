import AlertMessage from './AlertMessage'
import useOnlineStatus from '../../hooks/useOnlineStatus'

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="connection-status">
      <AlertMessage title="Sin conexión" tone="warning">
        Tus cambios se guardan en este dispositivo.
      </AlertMessage>
    </div>
  )
}
