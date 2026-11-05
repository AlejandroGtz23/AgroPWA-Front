import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cerrarSesion } from '../../auth/cerrarSesion'
import { contarRegistrosEnCola } from '../../storage/agroDb'
import AlertMessage from '../ui/AlertMessage'
import BaseButton from '../ui/BaseButton'

export default function CerrarSesion({ className = '' }) {
  const navigate = useNavigate()
  const [ocupado, setOcupado] = useState(false)
  const [pendientes, setPendientes] = useState(null)
  const [error, setError] = useState('')

  async function salir() {
    setOcupado(true)
    const { confirmado } = await cerrarSesion()
    navigate('/', { replace: true, state: confirmado ? null : { avisoSesion: 'Se cerró la sesión en este dispositivo, pero no se pudo confirmar el cierre en el servidor.' } })
  }

  async function comprobar() {
    if (ocupado) return
    setOcupado(true)
    setError('')
    try {
      const total = await contarRegistrosEnCola()
      if (total > 0) { setPendientes(total); setOcupado(false); return }
      await salir()
    } catch {
      setError('No se pudo comprobar la cola de sincronización. Intenta nuevamente antes de cerrar sesión.')
      setOcupado(false)
    }
  }

  return <div className={`cerrar-sesion ${className}`}>
    {pendientes !== null ? <AlertMessage title={`Tienes ${pendientes} registros sin sincronizar`} tone="warning">
      <span>Los registros se conservarán en este dispositivo. La sincronización todavía no está disponible.</span>
      <span className="cerrar-sesion__acciones"><BaseButton variant="secondary" onClick={() => navigate('/app/sincronizacion')}>Ver sincronización</BaseButton><BaseButton variant="secondary" onClick={() => setPendientes(null)}>Cancelar</BaseButton></span>
    </AlertMessage> : <BaseButton variant="secondary" onClick={comprobar} disabled={ocupado}>{ocupado ? 'Cerrando sesión…' : 'Cerrar sesión'}</BaseButton>}
    {error && <AlertMessage title="No se pudo cerrar sesión" tone="danger">{error}</AlertMessage>}
  </div>
}
