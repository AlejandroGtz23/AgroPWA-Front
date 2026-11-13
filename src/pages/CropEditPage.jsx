import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { editarCultivo, listarTiposCultivo, obtenerDetalleCultivo } from '../api/cultivos'
import { subirFotografia } from '../api/fotografias'
import { listarParcelas } from '../api/parcelas'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import SelectorFotoPortada from '../components/cultivos/SelectorFotoPortada'
import { comprimirFotografia } from '../components/cultivos/comprimirFotografia'
import { fechaActualMexico } from '../components/cultivos/reglasCultivo'
import { validarEdicionCultivo } from '../components/cultivos/reglasEdicionCultivo'
import useOnlineStatus from '../hooks/useOnlineStatus'

const vacio = { nombre: '', idTipoCultivo: '', variedad: '', fechaSiembra: '', idParcela: '', estado: 'activo', fechaCosecha: '', observaciones: '' }

function valorFecha(valor) { return valor ? String(valor).slice(0, 10) : '' }

function fechaModificacion(valor) {
  if (!valor) return 'No disponible'
  const normalizada = /^\d{4}-\d{2}-\d{2}$/.test(valor) ? `${valor}T12:00:00` : valor
  const fecha = new Date(normalizada)
  return Number.isNaN(fecha.getTime()) ? 'No disponible' : new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(fecha)
}

function valoresDeCultivo(cultivo) {
  return {
    nombre: cultivo.nombre || '',
    idTipoCultivo: String(cultivo.idTipoCultivo || ''),
    variedad: cultivo.variedad || '',
    fechaSiembra: valorFecha(cultivo.fechaSiembra),
    idParcela: String(cultivo.idParcela || ''),
    estado: String(cultivo.estado || 'activo').toLowerCase(),
    fechaCosecha: valorFecha(cultivo.fechaCosecha),
    observaciones: cultivo.observaciones || '',
  }
}

export default function CropEditPage() {
  const { cropId } = useParams()
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const hoy = fechaActualMexico()
  const [form, setForm] = useState(vacio)
  const [original, setOriginal] = useState(vacio)
  const [cultivo, setCultivo] = useState(null)
  const [tipos, setTipos] = useState([])
  const [parcelas, setParcelas] = useState([])
  const [errors, setErrors] = useState({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [intento, setIntento] = useState(0)
  const [portadaArchivo, setPortadaArchivo] = useState(null)
  const [portadaIdLocal, setPortadaIdLocal] = useState(null)
  const [portadaError, setPortadaError] = useState('')
  const [subiendoPortada, setSubiendoPortada] = useState(false)
  const formDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(original), [form, original])
  const dirty = formDirty || Boolean(portadaArchivo)

  useEffect(() => {
    const controller = new AbortController()
    setCargando(true)
    Promise.all([
      obtenerDetalleCultivo(cropId, { signal: controller.signal }),
      listarTiposCultivo({ signal: controller.signal }),
      listarParcelas({ signal: controller.signal }),
    ]).then(([detalle, listaTipos, listaParcelas]) => {
      if (controller.signal.aborted) return
      setCultivo(detalle.cultivo)
      setTipos(listaTipos)
      setParcelas(listaParcelas)
      const valores = valoresDeCultivo(detalle.cultivo)
      setForm(valores)
      setOriginal(valores)
      setErrors({})
      setMensaje(null)
    }).catch((error) => {
      if (!controller.signal.aborted) setMensaje({ tipo: error.status === 404 ? 'no-encontrado' : 'error', texto: error.status === 404 ? 'El cultivo no existe o no tienes acceso a él.' : online ? 'No se pudieron cargar los datos del cultivo. Intenta nuevamente.' : 'La edición offline aún no está disponible; no se guardarán cambios localmente.' })
    }).finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [cropId, intento])

  function cambiar(event) {
    const { name, value } = event.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setErrors((actual) => ({ ...actual, [name]: undefined }))
    setMensaje(null)
  }

  function cancelar() {
    if (dirty && !window.confirm('Tienes cambios sin guardar. ¿Quieres descartarlos?')) return
    navigate(`/app/cultivos/${cropId}`)
  }

  async function subirPortada(cultivoActualizado) {
    if (!portadaArchivo || !cultivoActualizado?.id || subiendoPortada) return false
    setSubiendoPortada(true)
    setPortadaError('')
    const identificadorLocal = portadaIdLocal || crypto.randomUUID()
    setPortadaIdLocal(identificadorLocal)
    try {
      const comprimida = await comprimirFotografia(portadaArchivo)
      const fotografia = await subirFotografia(cultivoActualizado.id, comprimida, { esPortada: true, idLocal: identificadorLocal })
      setCultivo((actual) => ({ ...actual, portadaUrl: fotografia.url }))
      setPortadaArchivo(null)
      setPortadaIdLocal(null)
      return true
    } catch (error) {
      setPortadaError(error.message || 'No se pudo subir la foto de portada. Puedes reintentar.')
      return false
    } finally {
      setSubiendoPortada(false)
    }
  }

  async function guardar(event) {
    event.preventDefault()
    const validacion = validarEdicionCultivo(form, hoy)
    setErrors(validacion)
    if (Object.keys(validacion).length || guardando) return
    if (!dirty) { setMensaje({ tipo: 'info', texto: 'No hay cambios pendientes.' }); return }
    if (!online) { setMensaje({ tipo: 'error', texto: 'No hay conexión. La edición offline sigue pendiente y tus cambios no se han guardado.' }); return }

    setGuardando(true)
    setMensaje(null)
    try {
      let actualizadoCultivo = cultivo
      if (formDirty) {
        const payload = {
          nombre: form.nombre.trim(),
          idTipoCultivo: Number(form.idTipoCultivo),
          variedad: form.variedad.trim() || null,
          fechaSiembra: form.fechaSiembra,
          idParcela: Number(form.idParcela),
          estado: form.estado,
          fechaCosecha: form.estado === 'finalizado' ? form.fechaCosecha : null,
          observaciones: form.observaciones.trim() || null,
        }
        const actualizado = await editarCultivo(cropId, payload)
        actualizadoCultivo = actualizado?.cultivo || actualizado || { ...cultivo, ...payload }
        setCultivo(actualizadoCultivo)
        const valores = valoresDeCultivo(actualizadoCultivo)
        setForm(valores)
        setOriginal(valores)
      }
      const portadaGuardada = portadaArchivo ? await subirPortada(actualizadoCultivo) : true
      setMensaje({ tipo: 'exito', texto: portadaGuardada ? 'Cambios guardados correctamente.' : 'Los datos se guardaron, pero la foto de portada sigue pendiente.' })
    } catch (error) {
      if (error.status === 400 && Object.keys(error.errors || {}).length) {
        const mapa = { Nombre: 'nombre', IdTipoCultivo: 'idTipoCultivo', FechaSiembra: 'fechaSiembra', IdParcela: 'idParcela', Estado: 'estado', FechaCosecha: 'fechaCosecha', Variedad: 'variedad', Observaciones: 'observaciones' }
        const nuevosErrores = {}
        Object.entries(error.errors).forEach(([campo, valor]) => {
          const nombre = mapa[campo] || mapa[campo.charAt(0).toUpperCase() + campo.slice(1)]
          if (nombre) nuevosErrores[nombre] = Array.isArray(valor) ? valor[0] : valor
        })
        setErrors(nuevosErrores)
        if (!Object.keys(nuevosErrores).length) setMensaje({ tipo: 'error', texto: error.message })
      } else setMensaje({ tipo: 'error', texto: error.status === 404 ? 'El cultivo ya no existe o no tienes acceso a él.' : error.message || 'No fue posible guardar los cambios.' })
    } finally { setGuardando(false) }
  }

  if (cargando) return <div className="page-shell"><p role="status">Cargando datos del cultivo…</p></div>
  if (mensaje?.tipo === 'no-encontrado') return <div className="page-shell stack"><AlertMessage title="Cultivo no encontrado" tone="warning">{mensaje.texto}</AlertMessage><BaseButton variant="secondary" onClick={() => navigate('/app/cultivos')}>Volver a Mis cultivos</BaseButton></div>
  if (!cultivo) return <div className="page-shell stack"><AlertMessage title="No se pudo abrir la edición" tone="warning">{mensaje?.texto || 'Intenta nuevamente.'}</AlertMessage><div className="row"><BaseButton variant="secondary" onClick={() => navigate(`/app/cultivos/${cropId}`)}>Volver al detalle</BaseButton><BaseButton onClick={() => setIntento((actual) => actual + 1)}>Reintentar</BaseButton></div></div>

  const parcelaSeleccionada = parcelas.find((parcela) => String(parcela.id) === form.idParcela)
  const alertTone = mensaje?.tipo === 'exito' ? 'info' : mensaje?.tipo === 'error' ? 'danger' : 'info'

  return <div className="page-shell stack">
    <div className="crop-form-heading"><Link to={`/app/cultivos/${cropId}`} aria-label="Volver al detalle">←</Link><div><span className="eyebrow">P07 · Editar cultivo</span><h1>Editar cultivo</h1></div></div>
    <p className="muted">Actualiza los datos del cultivo. Última modificación: {fechaModificacion(cultivo.fechaActualizacion || cultivo.actualizadoUtc)}.</p>
    {!online && <AlertMessage title="Sin conexión" tone="warning">Los cambios no se guardarán en este dispositivo porque la edición offline aún no está habilitada.</AlertMessage>}
    {mensaje && mensaje.tipo !== 'no-encontrado' && <AlertMessage title={mensaje.tipo === 'exito' ? 'Guardado' : 'Cultivo'} tone={alertTone}>{mensaje.texto}</AlertMessage>}
    <div className="crop-unsaved" role="status"><span className={`crop-unsaved__dot${dirty ? ' is-dirty' : ''}`} />{dirty ? 'Cambios sin guardar' : 'Todos los cambios están guardados'}</div>
    <BaseCard><form className="form-grid crop-form" onSubmit={guardar} noValidate>
      <h2>Datos del cultivo</h2>
      <BaseField id="editar-nombre" name="nombre" label="Nombre del cultivo *" value={form.nombre} onChange={cambiar} error={errors.nombre} maxLength={80} required disabled={guardando} />
      <div className="crop-form__columns">
        <BaseField id="editar-tipo" name="idTipoCultivo" label="Tipo de cultivo *" as="select" value={form.idTipoCultivo} onChange={cambiar} error={errors.idTipoCultivo} required disabled={guardando}><option value="">Seleccionar tipo</option>{tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}</BaseField>
        <BaseField id="editar-variedad" name="variedad" label="Variedad" value={form.variedad} onChange={cambiar} error={errors.variedad} maxLength={80} disabled={guardando} />
      </div>
      <div className="crop-form__columns">
        <BaseField id="editar-siembra" name="fechaSiembra" label="Fecha de siembra *" type="date" value={form.fechaSiembra} onChange={cambiar} error={errors.fechaSiembra} max={hoy} required disabled={guardando} />
        <BaseField id="editar-parcela" name="idParcela" label="Parcela *" as="select" value={form.idParcela} onChange={cambiar} error={errors.idParcela} required disabled={guardando}><option value="">Seleccionar parcela</option>{parcelas.map((parcela) => <option key={parcela.id} value={parcela.id}>{parcela.nombre}</option>)}</BaseField>
      </div>
      {parcelaSeleccionada && <div className="crop-parcel-summary"><span>Superficie</span><strong>{parcelaSeleccionada.superficieHa} ha</strong>{parcelaSeleccionada.ubicacionReferencia && <><span>Ubicación</span><strong>{parcelaSeleccionada.ubicacionReferencia}</strong></>}</div>}
      <BaseField id="editar-estado" name="estado" label="Estado del cultivo *" as="select" value={form.estado} onChange={cambiar} error={errors.estado} required disabled={guardando}><option value="activo">Activo</option><option value="finalizado">Finalizado</option><option value="perdido">Perdido</option></BaseField>
      {form.estado === 'finalizado' && <BaseField id="editar-cosecha" name="fechaCosecha" label="Fecha de cosecha *" type="date" value={form.fechaCosecha} onChange={cambiar} error={errors.fechaCosecha} min={form.fechaSiembra} max={hoy} required disabled={guardando} />}
       <div className="base-field"><label htmlFor="editar-observaciones">Observaciones</label><textarea id="editar-observaciones" name="observaciones" value={form.observaciones} onChange={cambiar} maxLength={300} disabled={guardando} aria-invalid={errors.observaciones ? true : undefined} aria-describedby="editar-observaciones-ayuda" />{errors.observaciones && <small role="alert">{errors.observaciones}</small>}<small id="editar-observaciones-ayuda" className="muted">{form.observaciones.length} / 300 caracteres</small></div>
       <SelectorFotoPortada archivo={portadaArchivo} src={cultivo.portadaUrl} onChange={(archivo) => { setPortadaArchivo(archivo); setPortadaIdLocal(null); setPortadaError('') }} disabled={guardando || !online} />
       {portadaError && <AlertMessage title="Foto de portada pendiente" tone="warning">{portadaError}</AlertMessage>}
       <div className="form-actions"><BaseButton variant="secondary" disabled={guardando} onClick={cancelar}>Cancelar</BaseButton><BaseButton type="submit" disabled={guardando || !online}>{guardando ? 'Guardando…' : 'Guardar cambios'}</BaseButton></div>
    </form></BaseCard>
  </div>
}
