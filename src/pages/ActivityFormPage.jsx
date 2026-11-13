import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { listarTiposActividad, registrarAvance } from '../api/actividades'
import { listarCultivos, obtenerDetalleCultivo } from '../api/cultivos'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import { esTipoActividad, validarActividad } from '../components/cultivos/reglasActividad'
import { fechaActualMexico } from '../components/cultivos/reglasCultivo'
import useOnlineStatus from '../hooks/useOnlineStatus'

const formularioInicial = (fecha) => ({
  idTipoActividad: '',
  fecha,
  descripcion: '',
  duracionMin: '',
  metodoRiego: '',
  producto: '',
  cantidad: '',
  unidad: '',
})

const estaActivo = (item) => String(item?.estado || '').toLowerCase() === 'activo'

function normalizarErroresApi(errores) {
  const campos = {
    idtipoactividad: 'idTipoActividad',
    fechaactividad: 'fecha',
    fecha: 'fecha',
    descripcion: 'descripcion',
    duracionmin: 'duracionMin',
    metodoriego: 'metodoRiego',
    producto: 'producto',
    cantidad: 'cantidad',
    unidad: 'unidad',
  }
  return Object.fromEntries(Object.entries(errores || {}).flatMap(([nombre, valor]) => {
    const campo = campos[nombre.toLowerCase()]
    return campo ? [[campo, Array.isArray(valor) ? valor[0] : valor]] : []
  }))
}

export default function ActivityFormPage() {
  const { cropId } = useParams()
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const hoy = fechaActualMexico()
  const [form, setForm] = useState(() => formularioInicial(hoy))
  const [tipos, setTipos] = useState([])
  const [cultivos, setCultivos] = useState([])
  const [cultivo, setCultivo] = useState(null)
  const [estado, setEstado] = useState('cargando')
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [idLocal, setIdLocal] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setEstado('cargando')
    Promise.all([
      listarTiposActividad({ signal: controller.signal }),
      listarCultivos({ estado: 'activo', pagina: 1, tamano: 100, signal: controller.signal }),
      obtenerDetalleCultivo(cropId, { signal: controller.signal }),
    ]).then(([listaTipos, respuestaCultivos, detalle]) => {
      if (controller.signal.aborted) return
      const opciones = respuestaCultivos.elementos || []
      const cultivoActual = detalle.cultivo
      setTipos(Array.isArray(listaTipos) ? listaTipos : [])
      setCultivo(cultivoActual)
      setCultivos(opciones.some((item) => String(item.id) === String(cultivoActual.id))
        ? opciones
        : [cultivoActual, ...opciones])
      setEstado(estaActivo(cultivoActual) ? 'listo' : 'inactivo')
    }).catch((error) => {
      if (!controller.signal.aborted) {
        setMensaje(error.status === 404
          ? 'No encontramos el cultivo para registrar el avance.'
          : 'No se pudieron cargar el cultivo y los tipos de actividad. Verifica tu conexión e intenta de nuevo.')
        setEstado('error')
      }
    })
    return () => controller.abort()
  }, [cropId])

  const tipoSeleccionado = useMemo(
    () => tipos.find((tipo) => String(tipo.id) === form.idTipoActividad),
    [tipos, form.idTipoActividad],
  )
  const esRiego = esTipoActividad(tipoSeleccionado?.nombre, 'riego')
  const esFertilizacion = esTipoActividad(tipoSeleccionado?.nombre, 'fertilizacion')

  function cambiar(event) {
    const { name, value } = event.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setErrores((actual) => ({ ...actual, [name]: undefined }))
    setMensaje('')
  }

  async function guardar(event) {
    event.preventDefault()
    const valores = { ...form, nombreTipo: tipoSeleccionado?.nombre || '' }
    const validacion = validarActividad(valores, cultivo, hoy)
    setErrores(validacion)
    setMensaje('')
    if (Object.keys(validacion).length || guardando) return
    if (!online) {
      setMensaje('No hay conexión. El guardado offline de avances no está habilitado hasta acordar el aislamiento de datos por usuario.')
      return
    }

    setGuardando(true)
    const identificadorLocal = idLocal || crypto.randomUUID()
    setIdLocal(identificadorLocal)
    const fechaActividad = new Date(`${form.fecha}T12:00:00`).toISOString()
    const payload = {
      idLocal: identificadorLocal,
      idTipoActividad: Number(form.idTipoActividad),
      fechaActividad,
      descripcion: form.descripcion.trim(),
      duracionMin: esRiego ? Number(form.duracionMin) : null,
      metodoRiego: esRiego ? form.metodoRiego.trim() : null,
      producto: esFertilizacion ? form.producto.trim() : null,
      cantidad: esFertilizacion ? Number(form.cantidad) : null,
      unidad: esFertilizacion ? form.unidad.trim() : null,
    }

    try {
      await registrarAvance(cropId, payload)
      navigate(`/app/cultivos/${cropId}`, { replace: true, state: { mensajeActividad: 'Avance guardado correctamente.' } })
    } catch (error) {
      const erroresApi = normalizarErroresApi(error.errors)
      setErrores(erroresApi)
      setMensaje(error.status === 409
        ? 'Solo se pueden registrar avances en cultivos activos.'
        : Object.keys(erroresApi).length
          ? ''
          : error.status === 0
            ? 'No se pudo confirmar el guardado. Se conservaron los datos; verifica tu conexión antes de reintentar.'
            : error.message || 'No fue posible guardar el avance.')
    } finally {
      setGuardando(false)
    }
  }

  if (estado === 'cargando') return <div className="page-shell"><p role="status">Cargando cultivo y tipos de actividad…</p></div>

  return <div className="page-shell stack">
    <div className="crop-form-heading"><Link to={`/app/cultivos/${cropId}`} aria-label="Volver al detalle del cultivo">←</Link><div><span className="eyebrow">P09 · Registrar avance</span><h1>Registrar actividad</h1></div></div>
    {mensaje && <AlertMessage title={estado === 'error' ? 'No se pudo preparar el formulario' : 'No se guardó el avance'} tone="warning">{mensaje}</AlertMessage>}
    {estado === 'inactivo' && <AlertMessage title="Cultivo no activo" tone="warning">Solo se pueden registrar avances en cultivos activos.</AlertMessage>}
    {!online && estado === 'listo' && <AlertMessage title="Sin conexión" tone="warning">El avance no se guardará en este dispositivo. El uso offline requiere acordar el aislamiento de datos por usuario.</AlertMessage>}
    <BaseCard>
      <form className="form-grid activity-form" onSubmit={guardar} noValidate>
        <p className="muted">Los campos con * son obligatorios.</p>
        <BaseField
          id="actividad-cultivo"
          label="Cultivo *"
          as="select"
          value={cropId}
          onChange={(event) => navigate(`/app/cultivos/${event.target.value}/actividad`)}
          disabled={estado !== 'listo' || guardando}
          required
        >
          <option value="">Seleccionar cultivo</option>
          {cultivos.filter(estaActivo).map((item) => (
            <option value={item.id} key={item.id}>{item.nombre} · {item.parcela}</option>
          ))}
        </BaseField>
        <BaseField id="actividad-tipo" name="idTipoActividad" label="Tipo de actividad *" as="select" value={form.idTipoActividad} onChange={cambiar} error={errores.idTipoActividad} required disabled={estado !== 'listo' || guardando}>
          <option value="">Seleccionar tipo</option>
          {tipos.map((tipo) => <option value={tipo.id} key={tipo.id}>{tipo.nombre}</option>)}
        </BaseField>
        <BaseField id="actividad-fecha" name="fecha" label="Fecha *" type="date" value={form.fecha} onChange={cambiar} error={errores.fecha} min={cultivo?.fechaSiembra?.slice(0, 10)} max={hoy} required disabled={estado !== 'listo' || guardando} />
        <BaseField id="actividad-descripcion" name="descripcion" label="Descripción *" as="textarea" placeholder="Describe la actividad" value={form.descripcion} onChange={cambiar} error={errores.descripcion} maxLength={1000} required disabled={estado !== 'listo' || guardando} />
        {esRiego && <>
          <BaseField id="actividad-duracion" name="duracionMin" label="Duración del riego (minutos) *" type="number" min="1" step="1" value={form.duracionMin} onChange={cambiar} error={errores.duracionMin} required disabled={guardando} />
          <BaseField id="actividad-metodo" name="metodoRiego" label="Método de riego *" placeholder="Ej. Goteo" value={form.metodoRiego} onChange={cambiar} error={errores.metodoRiego} required disabled={guardando} />
        </>}
        {esFertilizacion && <>
          <BaseField id="actividad-producto" name="producto" label="Producto *" value={form.producto} onChange={cambiar} error={errores.producto} required disabled={guardando} />
          <div className="activity-form__columns">
            <BaseField id="actividad-cantidad" name="cantidad" label="Cantidad *" type="number" min="0.01" step="any" value={form.cantidad} onChange={cambiar} error={errores.cantidad} required disabled={guardando} />
            <BaseField id="actividad-unidad" name="unidad" label="Unidad *" placeholder="Ej. kg" value={form.unidad} onChange={cambiar} error={errores.unidad} required disabled={guardando} />
          </div>
        </>}
        {estado === 'error' && <BaseButton variant="secondary" type="button" onClick={() => window.location.reload()}>Volver a intentar</BaseButton>}
        <div className="form-actions">
          <BaseButton variant="secondary" type="button" disabled={guardando} onClick={() => navigate(`/app/cultivos/${cropId}`)}>Cancelar</BaseButton>
          <BaseButton type="submit" disabled={estado !== 'listo' || guardando || !online}>{guardando ? 'Guardando…' : 'Guardar avance'}</BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
}
