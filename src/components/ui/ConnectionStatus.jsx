import { useEffect, useRef, useState } from 'react'
import { comprobarSalud } from '../../api/cliente'
import AlertMessage from './AlertMessage'
import useOnlineStatus from '../../hooks/useOnlineStatus'

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus()
  const [apiUnavailable, setApiUnavailable] = useState(false)
  const alreadyChecked = useRef(false)

  useEffect(() => {
    if (!isOnline) return undefined
    let active = true
    const renovar = alreadyChecked.current
    alreadyChecked.current = true
    comprobarSalud({ renovar }).then((result) => {
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
        {isOnline
          ? 'Agro todavía está iniciando o no respondió. Mantén la app abierta y vuelve a intentar la acción en unos segundos.'
          : 'Perdiste la conexión a Internet. Puedes seguir consultando la app, pero guardar o actualizar información requiere volver a conectarte.'}
      </AlertMessage>
    </div>
  )
}
