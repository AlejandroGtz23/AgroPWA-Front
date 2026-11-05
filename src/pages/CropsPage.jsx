import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarCultivos, listarTiposCultivo } from '../api/cultivos'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import StatusTag from '../components/ui/StatusTag'
import CultivoPortada from '../components/cultivos/CultivoPortada'
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
      setResultado({ elementos: data.elementos || [], total: data.total || 0 })
      setEstado('listo')
    } catch {
      if (!signal?.aborted) setEstado('error')
    }
  }, [consulta, estadoFiltro, tipoFiltro, pagina])

  useEffect(() => {
    const controller = new AbortController()
    cargar(controller.signal)
    return () => controller.abort()
  }, [cargar])

  function cambiarFiltro(callback, valor) {
    setPagina(1)
    callback(valor)
  }

  const inicio = resultado.total ? (pagina - 1) * pageSize + 1 : 0
  const fin = Math.min(pagina * pageSize, resultado.total)

  return <div className="page-shell stack">
    <div className="page-heading"><span className="eyebrow">P05 · Mis cultivos</span><h1>Mis cultivos</h1><p>{estado === 'listo' ? `${resultado.total} ${resultado.total === 1 ? 'cultivo registrado' : 'cultivos registrados'}` : 'Consulta y busca tus registros.'}</p></div>
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
    {estado === 'cargando' && <p role="status">Cargando cultivos…</p>}
    {estado === 'error' && <AlertMessage title="No se pudieron cargar tus cultivos" tone="warning">{online ? 'Verifica la conexión e intenta de nuevo.' : 'El acceso a cultivos sin conexión todavía no está habilitado; no hay datos en caché que se puedan mostrar.'} <BaseButton variant="secondary" onClick={() => cargar()}>Reintentar</BaseButton></AlertMessage>}
    {estado === 'listo' && resultado.total === 0 && <BaseCard className="crop-empty"><h2>{consulta || estadoFiltro || tipoFiltro ? 'No encontramos resultados' : 'Aún no tienes cultivos'}</h2><p className="muted">{consulta || estadoFiltro || tipoFiltro ? 'Prueba con otra búsqueda o quita los filtros.' : 'Registra tu primer cultivo para comenzar a llevar el seguimiento.'}</p>{!consulta && !estadoFiltro && !tipoFiltro && <Link to="/app/cultivos/nuevo"><BaseButton>Registrar mi primer cultivo</BaseButton></Link>}</BaseCard>}
    {estado === 'listo' && resultado.elementos.length > 0 && <>
      <div className="crop-grid">{resultado.elementos.map((crop) => <Link className="crop-link" to={`/app/cultivos/${crop.id}`} key={crop.id}>
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
      <div className="crop-pagination"><span>Mostrando {inicio}–{fin} de {resultado.total} cultivos</span><div className="row"><BaseButton variant="secondary" aria-label="Página anterior" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>‹</BaseButton><span aria-current="page">{pagina}</span><BaseButton variant="secondary" aria-label="Página siguiente" disabled={fin >= resultado.total} onClick={() => setPagina((p) => p + 1)}>›</BaseButton></div></div>
    </>}
    {estado === 'listo' && <Link className="crop-add" to="/app/cultivos/nuevo" aria-label="Registrar cultivo">+</Link>}
  </div>
}
