import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { obtenerDetalleCultivo } from '../api/cultivos'
import { programarEliminacionCultivo } from '../components/cultivos/gestorEliminacion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'
import CultivoPortada from '../components/cultivos/CultivoPortada'
import { diasDesdeSiembra } from '../components/cultivos/reglasCultivo'
import useOnlineStatus from '../hooks/useOnlineStatus'

function fechaCorta(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(`${value.slice(0, 10)}T12:00:00`))
}

function DialogoEliminar({ cultivo, totales, online, onCancelar, onConfirmar }) {
  const dialogo = useRef(null)
  useEffect(() => {
    dialogo.current?.showModal()
    return () => { if (dialogo.current?.open) dialogo.current.close() }
  }, [])

  return <dialog ref={dialogo} className="crop-confirm-dialog" aria-labelledby="titulo-confirmar-eliminacion" onCancel={(event) => { event.preventDefault(); onCancelar() }}>
    <span className="eyebrow">P08-B · Confirmar eliminación</span>
    <h2 id="titulo-confirmar-eliminacion">¿Eliminar este cultivo?</h2>
    <p>Vas a eliminar <strong>{cultivo.nombre}</strong> y su historial. Esta acción no se puede deshacer después de confirmar.</p>
    <ul><li>{totales.avances} {totales.avances === 1 ? 'avance' : 'avances'}</li><li>{totales.fotografias} {totales.fotografias === 1 ? 'fotografía' : 'fotografías'}</li></ul>
    <p className="muted">Al confirmar, tendrás 5 segundos para deshacer antes de enviar la eliminación al servidor.</p>
    {!online && <AlertMessage title="Sin conexión" tone="warning">La eliminación offline todavía no está disponible. Vuelve a intentarlo cuando tengas conexión.</AlertMessage>}
    <div className="crop-confirm-dialog__actions"><BaseButton variant="secondary" onClick={onCancelar}>Cancelar</BaseButton><BaseButton className="base-button--danger" disabled={!online} onClick={onConfirmar}>Sí, eliminar</BaseButton></div>
  </dialog>
}

export default function CropDetailPage() {
  const { cropId } = useParams()
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const [detalle, setDetalle] = useState(null)
  const [pestana, setPestana] = useState('avances')
  const [estado, setEstado] = useState('cargando')
  const [intento, setIntento] = useState(0)
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setEstado('cargando')
    obtenerDetalleCultivo(cropId, { signal: controller.signal }).then((data) => {
      if (controller.signal.aborted) return
      setDetalle(data)
      setEstado('listo')
    }).catch((error) => {
      if (controller.signal.aborted) return
      setEstado(error.status === 404 ? 'no-encontrado' : 'error')
    })
    return () => controller.abort()
  }, [cropId, intento])

  if (estado === 'cargando') return <div className="page-shell"><p role="status">Cargando cultivo…</p></div>
  if (estado === 'no-encontrado') return <div className="page-shell stack"><AlertMessage title="Cultivo no encontrado" tone="warning">El cultivo no existe o no tienes acceso a él.</AlertMessage><BaseButton variant="secondary" onClick={() => navigate('/app/cultivos', { replace: true })}>Volver a Mis cultivos</BaseButton></div>
  if (estado === 'error') return <div className="page-shell stack"><AlertMessage title="No se pudo cargar el cultivo" tone="warning">{online ? 'Verifica tu conexión e intenta de nuevo.' : 'El detalle offline aún no está implementado y no hay una copia local segura.'}</AlertMessage><div className="row"><BaseButton variant="secondary" onClick={() => navigate('/app/cultivos')}>Mis cultivos</BaseButton><BaseButton onClick={() => { setEstado('cargando'); setIntento((valor) => valor + 1) }}>Reintentar</BaseButton></div></div>

  const { cultivo, avances, fotografias, totales } = detalle
  const dias = cultivo.diasCultivo ?? diasDesdeSiembra(cultivo.fechaSiembra)
  const estadoVisual = cultivo.estado === 'Activo' ? 'success' : 'neutral'

  return <div className="page-shell stack crop-detail">
    <div className="crop-form-heading"><Link to="/app/cultivos" aria-label="Volver a mis cultivos">←</Link><div><span className="eyebrow">P07 · Detalle del cultivo</span><h1>Detalle del cultivo</h1></div></div>
    <BaseCard className="crop-detail__main">
      <CultivoPortada src={cultivo.portadaUrl} tipo={cultivo.tipo} />
      <div className="row row--between"><h2>{cultivo.nombre}</h2><StatusTag tone={estadoVisual}>{cultivo.estado}</StatusTag></div>
      <p className="crop-sync-label">{cultivo.estadoSincronizacion || 'Sincronizado'}{cultivo.actualizadoUtc ? ` · ${fechaCorta(cultivo.actualizadoUtc)}` : ''}</p>
      <dl className="crop-detail__facts">
        {[['Tipo', cultivo.tipo], ['Variedad', cultivo.variedad || '—'], ['Parcela', cultivo.parcela], ['Superficie', `${cultivo.superficieHa} ha`], ['Siembra', fechaCorta(cultivo.fechaSiembra)], ['Días de cultivo', `${dias} días`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      {cultivo.observaciones && <div className="crop-observations"><strong>Observaciones</strong><p>{cultivo.observaciones}</p></div>}
      <div className="crop-detail__actions"><Link to={`/app/cultivos/${cropId}/editar`}><BaseButton variant="secondary">✎ Editar</BaseButton></Link><BaseButton variant="secondary" className="base-button--danger-outline" disabled={!online} title={!online ? 'La eliminación offline no está habilitada' : undefined} onClick={() => setConfirmarEliminacion(true)}>Eliminar</BaseButton><BaseButton disabled title="El registro de avances corresponde a HU-19">+ Registrar avance</BaseButton></div>
    </BaseCard>
    <div className="crop-tabs" role="tablist" aria-label="Información del cultivo">
      <button type="button" role="tab" aria-selected={pestana === 'avances'} onClick={() => setPestana('avances')}>Avances ({totales.avances})</button>
      <button type="button" role="tab" aria-selected={pestana === 'fotografias'} onClick={() => setPestana('fotografias')}>Fotografías ({totales.fotografias})</button>
    </div>
    {pestana === 'avances' && <section className="crop-timeline" aria-label="Historial de avances">
      {avances.length ? avances.map((avance) => <BaseCard className="crop-timeline__item" key={avance.id}><div className="row row--between"><StatusTag>{avance.tipo}</StatusTag><time dateTime={avance.fechaActividad}>{fechaCorta(avance.fechaActividad)}</time></div><p>{avance.descripcion}</p><span className="muted">{avance.fotos} {avance.fotos === 1 ? 'foto' : 'fotos'}</span></BaseCard>) : <BaseCard className="crop-empty"><h2>Aún no hay avances</h2><p className="muted">El registro de avances se habilitará en HU-19.</p><BaseButton disabled>+ Registrar avance</BaseButton></BaseCard>}
    </section>}
    {pestana === 'fotografias' && (fotografias.length ? <div className="crop-photo-grid">{fotografias.map((foto) => <figure key={foto.id}><img src={foto.url} alt={`Fotografía del cultivo ${cultivo.nombre}`} loading="lazy" /><figcaption>{fechaCorta(foto.fechaCaptura)}{foto.esPortada ? ' · Portada' : ''}</figcaption></figure>)}</div> : <BaseCard className="crop-empty"><h2>Aún no hay fotografías</h2><p className="muted">La captura y carga de fotografías corresponde a HU-20.</p></BaseCard>)}
    {confirmarEliminacion && <DialogoEliminar cultivo={cultivo} totales={totales} online={online} onCancelar={() => setConfirmarEliminacion(false)} onConfirmar={() => {
      programarEliminacionCultivo(cultivo)
      setConfirmarEliminacion(false)
      navigate('/app/cultivos')
    }} />}
  </div>
}
