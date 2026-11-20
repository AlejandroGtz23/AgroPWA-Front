import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerResumenDashboard } from '../api/dashboard'
import { obtenerSesion } from '../auth/sesion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'
import useOnlineStatus from '../hooks/useOnlineStatus'

export default function DashboardPage() {
  const online = useOnlineStatus()
  const nombreSesion = obtenerSesion()?.usuario?.nombre
  const [resumen, setResumen] = useState(null)
  const [estado, setEstado] = useState('cargando')
  const cargar = useCallback(async (signal) => {
    setEstado('cargando')
    try {
      const datos = await obtenerResumenDashboard({ signal })
      if (signal?.aborted) return
      setResumen(datos)
      setEstado('listo')
    } catch {
      if (!signal?.aborted) setEstado('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    cargar(controller.signal)
    return () => controller.abort()
  }, [cargar])

  const hoy = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date())
  const actividadReciente = resumen?.actividadReciente?.slice(0, 3) || []

  return <div className="page-shell stack">
    <div className="dashboard-welcome">
      <div className="page-heading"><span className="eyebrow">{hoy}</span><h1>Hola{resumen?.nombre || nombreSesion ? `, ${resumen?.nombre || nombreSesion}` : ''}</h1></div>
      <Link to="/app/cultivos/nuevo"><BaseButton>+ Registrar cultivo</BaseButton></Link>
      <StatusTag tone={online ? 'success' : 'warning'}>{online ? 'En línea' : 'Sin conexión'}</StatusTag>
    </div>
    {estado === 'cargando' && <p role="status">Cargando resumen…</p>}
    {estado === 'error' && <AlertMessage title="No se pudo cargar tu resumen" tone="warning">Verifica la conexión e inténtalo de nuevo. El dashboard sin conexión aún no está disponible. <BaseButton variant="secondary" onClick={() => cargar()}>Reintentar</BaseButton></AlertMessage>}
    {estado === 'listo' && <>
      <section className="stats-grid" aria-label="Resumen">
        <BaseCard className="stat"><span>Cultivos activos</span><strong>{resumen.cultivosActivos}</strong></BaseCard>
        <BaseCard className="stat"><span>Avances este mes</span><strong>{resumen.avancesDelMes}</strong></BaseCard>
      </section>
      <BaseCard className="dashboard-recent">
        <div className="dashboard-section-heading"><h2>Actividad reciente</h2><Link to="/app/cultivos">Ver cultivos <span aria-hidden="true">→</span></Link></div>
        {actividadReciente.length ? <div className="dashboard-recent__list">{actividadReciente.map((actividad, index) => <div className="dashboard-recent__item" key={`${actividad.fecha}-${index}`}><div><strong>{actividad.cultivo}</strong><time>{new Date(actividad.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</time></div><StatusTag>{actividad.tipo}</StatusTag></div>)}</div> : <p className="muted dashboard-empty">Aún no hay avances registrados.</p>}
      </BaseCard>
    </>}
    <nav className="dashboard-shortcuts" aria-label="Accesos rápidos">
      <Link to="/app/cultivos"><span aria-hidden="true">▦</span>Mis cultivos</Link>
      <Link to="/app/perfil"><span aria-hidden="true">⌖</span>Mis parcelas</Link>
    </nav>
  </div>
}
