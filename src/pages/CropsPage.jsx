import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarCultivos, listarTiposCultivo } from '../api/cultivos'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import StatusTag from '../components/ui/StatusTag'
import CultivoPortada from '../components/cultivos/CultivoPortada'
import { deshacerEliminacionCultivo, observarEliminaciones, observarResultadoEliminacion } from '../components/cultivos/gestorEliminacion'
import { diasDesdeSiembra } from '../components/cultivos/reglasCultivo'
import useOnlineStatus from '../hooks/useOnlineStatus'

const pageSize = 20

export default function CropsPage() {
  const online = useOnlineStatus()
  const [buscar, setBuscar] = useState('')
  const [consulta, setConsulta] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [pagina, setPagina] = useState(1)
  const [tipos, setTipos] = useState([])
  const [resultado, setResultado] = useState({ elementos: [], total: 0 })
  const [estado, setEstado] = useState('cargando')
  const [eliminaciones, setEliminaciones] = useState([])
  const [mensajeAccion, setMensajeAccion] = useState(null)
  const [ahora, setAhora] = useState(Date.now())

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPagina(1)
      setConsulta(buscar.trim())
    }, 250)
    return () => window.clearTimeout(timer)
  }, [buscar])

  useEffect(() => {
    const controller = new AbortController()
    listarTiposCultivo({ signal: controller.signal }).then(setTipos).catch(() => {
      if (!controller.signal.aborted) setTipos([])
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!eliminaciones.length) return undefined
    const timer = window.setInterval(() => setAhora(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [eliminaciones.length])

  const cargar = useCallback(async (signal) => {
    setEstado('cargando')
    try {
      const data = await listarCultivos({
        buscar: consulta,
        estado: estadoFiltro,
        idTipoCultivo: tipoFiltro,
        pagina,
        tamano: pageSize,
        signal,
      })
      if (signal?.aborted) return
      const total = data.total || 0
      const ultimaPagina = Math.max(1, Math.ceil(total / pageSize))
      if (pagina > ultimaPagina) { setPagina(ultimaPagina); return }
      setResultado({ elementos: data.elementos || [], total })
      setEstado('listo')
    } catch {
      if (!signal?.aborted) setEstado('error')
    }
  }, [consulta, estadoFiltro, tipoFiltro, pagina])

  useEffect(() => observarEliminaciones(setEliminaciones), [])

  useEffect(() => observarResultadoEliminacion((resultadoEliminacion) => {
    if (resultadoEliminacion.ok) {
      setMensajeAccion(null)
      cargar()
    } else {
      setMensajeAccion('No se pudo eliminar el cultivo. El registro sigue en tu lista; intenta de nuevo.')
      cargar()
    }
  }), [cargar])

  useEffect(() => {
    const controller = new AbortController()
    cargar(controller.signal)
    return () => controller.abort()
  }, [cargar])

  function cambiarFiltro(callback, valor) {
    setPagina(1)
    callback(valor)
  }

  const idsPendientes = new Set(eliminaciones.map((item) => item.id))
  const elementosVisibles = resultado.elementos.filter((crop) => !idsPendientes.has(String(crop.id)))
  const eliminacionesEnPagina = eliminaciones.filter((item) => resultado.elementos.some((crop) => String(crop.id) === item.id)).length
  const totalVisible = Math.max(0, resultado.total - eliminacionesEnPagina)
  const inicio = totalVisible ? (pagina - 1) * pageSize + 1 : 0
  const fin = Math.min(pagina * pageSize, totalVisible)

  return <div className="page-shell stack">
    <div className="page-heading"><span className="eyebrow">P05 · Mis cultivos</span><h1>Mis cultivos</h1><p>{estado === 'listo' ? `${totalVisible} ${totalVisible === 1 ? 'cultivo registrado' : 'cultivos registrados'}` : 'Consulta y busca tus registros.'}</p></div>
    <div className="crop-toolbar">
      <BaseField id="buscar-cultivo" label="Buscar por cultivo o parcela" placeholder="Ej. Maíz o Parcela Norte" value={buscar} maxLength={80} onChange={(event) => setBuscar(event.target.value)} />
      <BaseField id="filtrar-tipo" label="Tipo de cultivo" as="select" value={tipoFiltro} onChange={(event) => cambiarFiltro(setTipoFiltro, event.target.value)}>
        <option value="">Todos los tipos</option>{tipos.map((tipo) => <option value={tipo.id} key={tipo.id}>{tipo.nombre}</option>)}
      </BaseField>
      <BaseButton variant="secondary" onClick={() => cambiarFiltro(setEstadoFiltro, '')}>Quitar filtros</BaseButton>
    </div>
    <div className="crop-filter-row" aria-label="Filtrar por estado">
      {[[ '', 'Todos' ], ['activo', 'Activos'], ['finalizado', 'Finalizados'], ['perdido', 'Perdidos']].map(([value, label]) => <button className={`crop-filter${estadoFiltro === value ? ' is-selected' : ''}`} type="button" key={value || 'todos'} aria-pressed={estadoFiltro === value} onClick={() => cambiarFiltro(setEstadoFiltro, value)}>{label}</button>)}
      <span className="crop-filter crop-filter--disabled" title="La cola local aún no está aislada por usuario">Pendientes · no disponible</span>
    </div>
    {eliminaciones.map((item) => <AlertMessage key={item.id} title={item.estado === 'eliminando' ? 'Eliminando cultivo…' : 'Cultivo eliminado'} tone="warning">
      <span>{item.estado === 'eliminando' ? `${item.nombre}: enviando la eliminación al servidor.` : `${item.nombre}: puedes deshacer durante ${Math.max(1, Math.ceil((item.venceEn - ahora) / 1000))} segundos.`}</span>
      {item.estado === 'deshacible' && <BaseButton variant="secondary" onClick={() => deshacerEliminacionCultivo(item.id)}>Deshacer</BaseButton>}
    </AlertMessage>)}
    {mensajeAccion && <AlertMessage title="No se completó la eliminación" tone="danger">{mensajeAccion}</AlertMessage>}
    {estado === 'cargando' && <p role="status">Cargando cultivos…</p>}
    {estado === 'error' && <AlertMessage title="No se pudieron cargar tus cultivos" tone="warning">{online ? 'Verifica la conexión e intenta de nuevo.' : 'El acceso a cultivos sin conexión todavía no está habilitado; no hay datos en caché que se puedan mostrar.'} <BaseButton variant="secondary" onClick={() => cargar()}>Reintentar</BaseButton></AlertMessage>}
    {estado === 'listo' && totalVisible === 0 && <BaseCard className="crop-empty"><h2>{eliminaciones.length ? 'Cultivo eliminado' : consulta || estadoFiltro || tipoFiltro ? 'No encontramos resultados' : 'Aún no tienes cultivos'}</h2><p className="muted">{eliminaciones.length ? 'La lista se actualizará al terminar la operación.' : consulta || estadoFiltro || tipoFiltro ? 'Prueba con otra búsqueda o quita los filtros.' : 'Registra tu primer cultivo para comenzar a llevar el seguimiento.'}</p>{!eliminaciones.length && !consulta && !estadoFiltro && !tipoFiltro && <Link to="/app/cultivos/nuevo"><BaseButton>Registrar mi primer cultivo</BaseButton></Link>}</BaseCard>}
    {estado === 'listo' && elementosVisibles.length > 0 && <>
      <div className="crop-grid">{elementosVisibles.map((crop) => <Link className="crop-link" to={`/app/cultivos/${crop.id}`} key={crop.id}>
        <BaseCard className="crop-card">
          <CultivoPortada src={crop.portadaUrl} tipo={crop.tipo} compact />
          <div className="crop-card__body">
            <div className="row row--between"><h2>{crop.nombre}</h2><StatusTag tone={crop.estado === 'Activo' ? 'success' : 'neutral'}>{crop.estado}</StatusTag></div>
            <p className="muted">{crop.tipo} · {crop.parcela}</p>
            <div className="row row--between crop-card__meta"><span>{crop.estado === 'Finalizado' ? `Cosechado ${crop.fechaCosecha || '—'}` : `Siembra: ${crop.fechaSiembra}`}</span><strong>{crop.estado === 'Finalizado' ? '' : `${crop.diasCultivo ?? diasDesdeSiembra(crop.fechaSiembra)} días`}</strong></div>
            <div className="crop-card__footer"><span>{crop.estadoSincronizacion || 'Sincronizado'}</span><span>Ver detalle →</span></div>
          </div>
        </BaseCard>
      </Link>)}</div>
      <div className="crop-pagination"><span>Mostrando {inicio}–{fin} de {totalVisible} cultivos</span><div className="row"><BaseButton variant="secondary" aria-label="Página anterior" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>‹</BaseButton><span aria-current="page">{pagina}</span><BaseButton variant="secondary" aria-label="Página siguiente" disabled={fin >= totalVisible} onClick={() => setPagina((p) => p + 1)}>›</BaseButton></div></div>
    </>}
    {estado === 'listo' && <Link className="crop-add" to="/app/cultivos/nuevo" aria-label="Registrar cultivo">+</Link>}
  </div>
}
