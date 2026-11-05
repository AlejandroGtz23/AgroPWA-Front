import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerResumenDashboard } from '../api/dashboard'
import { obtenerSesion } from '../auth/sesion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'

export default function DashboardPage() {
  const userId = obtenerSesion()?.usuario?.id
  const claveGuia = `agro.guia.oculta.${userId}`
  const [guiaOculta, setGuiaOculta] = useState(() => {
    try { return localStorage.getItem(claveGuia) === 'true' } catch { return false }
  })
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

  function alternarGuia() {
    const siguiente = !guiaOculta
    setGuiaOculta(siguiente)
    try { localStorage.setItem(claveGuia, String(siguiente)) } catch { /* Preferencia solo para esta visita. */ }
  }

  const hoy = new Intl.DateTimeFormat('es-MX', { dateStyle: 'full' }).format(new Date())
  const pasos = resumen ? [['Registra una parcela', resumen.guia.tieneParcela], ['Registra un cultivo', resumen.guia.tieneCultivo], ['Registra un avance', resumen.guia.tieneAvance]] : []

  return <div className="page-shell stack">
    <div className="page-heading"><span className="eyebrow">P04 · Dashboard</span><h1>Hola{resumen?.nombre ? `, ${resumen.nombre}` : ''}</h1><p>{hoy} · Resumen general de tus cultivos.</p></div>
    {estado === 'cargando' && <p role="status">Cargando resumen…</p>}
    {estado === 'error' && <AlertMessage title="No se pudo cargar tu resumen" tone="warning">Verifica la conexión e inténtalo de nuevo. El dashboard sin conexión aún no está disponible. <BaseButton variant="secondary" onClick={() => cargar()}>Reintentar</BaseButton></AlertMessage>}
    {estado === 'listo' && <>
      <section className="stats-grid" aria-label="Resumen"><div className="stat"><strong>{resumen.cultivosActivos}</strong><span>Cultivos activos</span></div><div className="stat"><strong>{resumen.avancesDelMes}</strong><span>Avances del mes</span></div><div className="stat"><strong>—</strong><span>Pendientes de sincronizar: no disponible</span></div></section>
      <BaseCard className="stack"><div className="row row--between"><h2>¿Cómo usar Agro?</h2><BaseButton variant="secondary" onClick={alternarGuia}>{guiaOculta ? 'Mostrar guía' : 'Ocultar guía'}</BaseButton></div>{!guiaOculta && <ul>{pasos.map(([titulo, completado]) => <li key={titulo}>{completado ? '✓' : '○'} {titulo}</li>)}</ul>}</BaseCard>
      <BaseCard className="stack"><h2>Actividad reciente</h2>{resumen.actividadReciente.length ? resumen.actividadReciente.map((actividad, index) => <div className="row row--between" key={`${actividad.fecha}-${index}`}><div><strong>{actividad.cultivo}</strong><p className="muted">{new Date(actividad.fecha).toLocaleString('es-MX')}</p></div><StatusTag>{actividad.tipo}</StatusTag></div>) : <p className="muted">Aún no hay actividad registrada.</p>}</BaseCard>
    </>}
    <BaseCard className="stack"><h2>¿Qué deseas hacer?</h2><p className="muted">La gestión de cultivos, avances y sincronización aún se encuentra en demostración.</p><div className="dashboard-actions"><Link to="/app/cultivos/nuevo">Registrar cultivo</Link><Link to="/app/cultivos">Ver mis cultivos o registrar avance</Link><Link to="/app/sincronizacion">Sincronización</Link><Link to="/app/perfil">Mis parcelas</Link></div></BaseCard>
  </div>
}
