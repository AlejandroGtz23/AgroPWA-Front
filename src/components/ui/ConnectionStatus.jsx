import { useEffect, useState } from 'react'
import { comprobarSalud } from '../../api/cliente'
import AlertMessage from './AlertMessage'
import useOnlineStatus from '../../hooks/useOnlineStatus'

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus()
  const [apiUnavailable, setApiUnavailable] = useState(false)

  useEffect(() => {
    if (!isOnline) return undefined
    let active = true
    comprobarSalud().then((result) => {
      if (active) setApiUnavailable(result?.estado !== 'OK')
    }).catch(() => {
      if (active) setApiUnavailable(true)
    })
    return () => { active = false }
  }, [isOnline])

  if (isOnline && !apiUnavailable) return null

  return (
    <div className="connection-status">
      <AlertMessage title={isOnline ? 'Servidor no disponible' : 'Sin conexión'} tone="warning">
        {isOnline ? 'No fue posible comprobar la conexión con el servidor.' : 'Algunas funciones requieren conexión a Internet.'}
      </AlertMessage>
    </div>
  )
}
