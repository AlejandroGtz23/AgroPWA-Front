import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listarTiposCultivo, registrarCultivo } from '../api/cultivos'
import { subirFotografia } from '../api/fotografias'
import { listarParcelas } from '../api/parcelas'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import SelectorFotoPortada from '../components/cultivos/SelectorFotoPortada'
import { comprimirFotografia } from '../components/cultivos/comprimirFotografia'
import { fechaActualMexico, validarCultivo } from '../components/cultivos/reglasCultivo'
import useOnlineStatus from '../hooks/useOnlineStatus'

const inicial = { nombre: '', idTipoCultivo: '', variedad: '', fechaSiembra: '', idParcela: '', observaciones: '' }

export default function CropFormPage() {
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const hoy = fechaActualMexico()
  const [form, setForm] = useState(inicial)
  const [tipos, setTipos] = useState([])
  const [parcelas, setParcelas] = useState([])
  const [errors, setErrors] = useState({})
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [resultado, setResultado] = useState(null)
  const [resultadoIncierto, setResultadoIncierto] = useState(false)
  const [idLocal, setIdLocal] = useState(null)
  const [portadaArchivo, setPortadaArchivo] = useState(null)
  const [portadaIdLocal, setPortadaIdLocal] = useState(null)
  const [portadaError, setPortadaError] = useState('')
  const [subiendoPortada, setSubiendoPortada] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([listarTiposCultivo({ signal: controller.signal }), listarParcelas({ signal: controller.signal })])
      .then(([listaTipos, listaParcelas]) => {
        if (controller.signal.aborted) return
        setTipos(listaTipos)
        setParcelas(listaParcelas)
      })
      .catch(() => { if (!controller.signal.aborted) setMensaje('No se pudieron cargar los catálogos. Verifica tu conexión e intenta de nuevo.') })
      .finally(() => { if (!controller.signal.aborted) setCargandoCatalogos(false) })
    return () => controller.abort()
  }, [])

  function cambiar(event) {
    const { name, value } = event.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setErrors((actual) => ({ ...actual, [name]: undefined }))
    setMensaje('')
  }

  async function subirPortada(cultivoCreado = resultado) {
    if (!cultivoCreado?.id || !portadaArchivo || subiendoPortada) return
    setSubiendoPortada(true)
    setPortadaError('')
    try {
      const comprimida = await comprimirFotografia(portadaArchivo)
      const identificadorLocal = portadaIdLocal || crypto.randomUUID()
      setPortadaIdLocal(identificadorLocal)
      const fotografia = await subirFotografia(cultivoCreado.id, comprimida, { esPortada: true, idLocal: identificadorLocal })
      setResultado((actual) => ({ ...actual, portadaUrl: fotografia.url }))
      setPortadaArchivo(null)
      setPortadaIdLocal(null)
    } catch (error) {
      setPortadaError(error.message || 'El cultivo se guardó, pero no se pudo subir la foto de portada. Puedes reintentar.')
    } finally {
      setSubiendoPortada(false)
    }
  }

  async function guardar(event) {
    event.preventDefault()
    const validacion = validarCultivo(form, hoy)
    setErrors(validacion)
    if (Object.keys(validacion).length || guardando) return
    if (!online) { setMensaje('No hay conexión. El guardado sin conexión aún no está disponible para cultivos.'); return }
    setGuardando(true)
    setMensaje('')
    const identificadorLocal = idLocal || crypto.randomUUID()
    setIdLocal(identificadorLocal)
    const payload = {
      idLocal: identificadorLocal,
      nombre: form.nombre.trim(),
      idTipoCultivo: Number(form.idTipoCultivo),
      variedad: form.variedad.trim() || null,
      fechaSiembra: form.fechaSiembra,
      idParcela: Number(form.idParcela),
      observaciones: form.observaciones.trim() || null,
    }
    try {
      const creado = await registrarCultivo(payload)
      setResultado(creado)
      setResultadoIncierto(false)
      if (portadaArchivo) await subirPortada(creado)
    } catch (error) {
      if (error.status === 0) {
        setResultadoIncierto(true)
        setMensaje('No se pudo confirmar el guardado. Reintenta con los mismos datos para evitar duplicar el cultivo.')
      } else if (error.status === 400 && Object.keys(error.errors || {}).length) {
        const mapeo = { Nombre: 'nombre', IdTipoCultivo: 'idTipoCultivo', FechaSiembra: 'fechaSiembra', IdParcela: 'idParcela', Variedad: 'variedad', Observaciones: 'observaciones' }
        const nuevosErrores = {}
        for (const [key, value] of Object.entries(error.errors)) {
          const campo = mapeo[key] || mapeo[key.charAt(0).toUpperCase() + key.slice(1)]
          if (campo) nuevosErrores[campo] = Array.isArray(value) ? value[0] : value
        }
        setErrors(nuevosErrores)
        if (!Object.keys(nuevosErrores).length) setMensaje(error.message)
      } else setMensaje(error.message || 'No fue posible guardar el cultivo.')
    } finally { setGuardando(false) }
  }

  if (resultado) return <div className="page-shell stack">
    <BaseCard className="crop-result"><span className="crop-result__check" aria-hidden="true">✓</span><span className="eyebrow">P08-A · Resultado</span><h1>¡Cultivo guardado!</h1><p>Tu registro se guardó en línea correctamente.</p>
      {subiendoPortada && <p role="status">Subiendo foto de portada…</p>}
      {portadaError && <AlertMessage title="Foto de portada pendiente" tone="warning">{portadaError}</AlertMessage>}
      {portadaArchivo && !subiendoPortada && <BaseButton variant="secondary" onClick={() => subirPortada(resultado)}>Reintentar foto de portada</BaseButton>}
      {resultado.portadaUrl && <img className="crop-photo-note__preview" src={resultado.portadaUrl} alt={`Foto de portada de ${resultado.nombre}`} />}
      <dl className="crop-summary"><div><dt>Nombre</dt><dd>{resultado.nombre}</dd></div><div><dt>Tipo</dt><dd>{resultado.tipo}</dd></div><div><dt>Parcela</dt><dd>{resultado.parcela}</dd></div><div><dt>Fecha de siembra</dt><dd>{resultado.fechaSiembra}</dd></div></dl>
      <div className="form-actions"><Link to="/app/cultivos"><BaseButton variant="secondary">Ver mis cultivos</BaseButton></Link><Link to={`/app/cultivos/${resultado.id}`}><BaseButton>Ver detalle</BaseButton></Link></div>
    </BaseCard>
  </div>

  const parcelaSeleccionada = parcelas.find((parcela) => String(parcela.id) === form.idParcela)

  return <div className="page-shell stack">
    <div className="crop-form-heading"><Link to="/app/cultivos" aria-label="Volver a mis cultivos">←</Link><div><span className="eyebrow">P06 · Nuevo cultivo</span><h1>Nuevo cultivo</h1></div></div>
    <p className="muted">Completa la información de tu cultivo. Los campos con * son obligatorios.</p>
    {mensaje && <AlertMessage title="Cultivo" tone="warning">{mensaje}</AlertMessage>}
    {!online && <AlertMessage title="Sin conexión" tone="warning">No se guardará el cultivo en este dispositivo. El uso offline requiere acordar el aislamiento de datos por usuario.</AlertMessage>}
    <BaseCard><form className="form-grid crop-form" onSubmit={guardar} noValidate>
      <h2>Datos del cultivo</h2>
      <BaseField id="cultivo-nombre" name="nombre" label="Nombre del cultivo *" placeholder="Ej. Maíz criollo" value={form.nombre} onChange={cambiar} error={errors.nombre} maxLength={80} required disabled={resultadoIncierto || guardando} />
      <div className="crop-form__columns">
        <BaseField id="cultivo-tipo" name="idTipoCultivo" label="Tipo de cultivo *" as="select" value={form.idTipoCultivo} onChange={cambiar} error={errors.idTipoCultivo} required disabled={cargandoCatalogos || resultadoIncierto || guardando}><option value="">{cargandoCatalogos ? 'Cargando tipos…' : 'Seleccionar tipo'}</option>{tipos.map((tipo) => <option value={tipo.id} key={tipo.id}>{tipo.nombre}</option>)}</BaseField>
        <BaseField id="cultivo-variedad" name="variedad" label="Variedad" placeholder="Ej. Criollo" value={form.variedad} onChange={cambiar} error={errors.variedad} maxLength={80} disabled={resultadoIncierto || guardando} />
      </div>
      <BaseField id="cultivo-siembra" name="fechaSiembra" label="Fecha de siembra *" type="date" value={form.fechaSiembra} onChange={cambiar} error={errors.fechaSiembra} max={hoy} required disabled={resultadoIncierto || guardando} />
      <BaseField id="cultivo-parcela" name="idParcela" label="Parcela *" as="select" value={form.idParcela} onChange={cambiar} error={errors.idParcela} required disabled={cargandoCatalogos || resultadoIncierto || guardando}><option value="">{cargandoCatalogos ? 'Cargando parcelas…' : 'Seleccionar parcela'}</option>{parcelas.map((parcela) => <option value={parcela.id} key={parcela.id}>{parcela.nombre}</option>)}</BaseField>
      {!cargandoCatalogos && parcelas.length === 0 && <AlertMessage title="Necesitas una parcela" tone="info">Registra primero una parcela en <Link to="/app/perfil">Mi perfil</Link>.</AlertMessage>}
      {parcelaSeleccionada && <div className="crop-parcel-summary"><span>Superficie</span><strong>{parcelaSeleccionada.superficieHa} ha</strong>{parcelaSeleccionada.ubicacionReferencia && <><span>Ubicación</span><strong>{parcelaSeleccionada.ubicacionReferencia}</strong></>}</div>}
      <div className="base-field"><label htmlFor="cultivo-observaciones">Observaciones</label><textarea id="cultivo-observaciones" name="observaciones" value={form.observaciones} onChange={cambiar} maxLength={300} disabled={resultadoIncierto || guardando} aria-invalid={errors.observaciones ? true : undefined} aria-describedby="cultivo-observaciones-ayuda" placeholder="Información adicional" />{errors.observaciones && <small role="alert">{errors.observaciones}</small>}<small id="cultivo-observaciones-ayuda" className="muted">{form.observaciones.length} / 300 caracteres</small></div>
       <SelectorFotoPortada archivo={portadaArchivo} onChange={(archivo) => { setPortadaArchivo(archivo); setPortadaIdLocal(null) }} disabled={resultadoIncierto || guardando || !online} />
      <AlertMessage title="Guardado en línea" tone="info">La captura y consulta sin conexión quedan pendientes hasta acordar el aislamiento por usuario y la cola de sincronización.</AlertMessage>
      <div className="form-actions"><BaseButton variant="secondary" disabled={guardando} onClick={() => navigate('/app/cultivos')}>Cancelar</BaseButton><BaseButton type="submit" disabled={guardando || cargandoCatalogos}>{guardando ? 'Guardando…' : resultadoIncierto ? 'Reintentar guardado' : 'Guardar cultivo'}</BaseButton></div>
    </form></BaseCard>
  </div>
}
