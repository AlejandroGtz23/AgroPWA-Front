import { useCallback, useEffect, useRef, useState } from 'react'
import { editarParcela, listarParcelas, registrarParcela } from '../../api/parcelas'
import { validarParcela } from './reglasParcela'
import useOnlineStatus from '../../hooks/useOnlineStatus'
import AlertMessage from '../ui/AlertMessage'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'
import BaseField from '../ui/BaseField'

const vacia = { nombre: '', superficieHa: '', ubicacionReferencia: '' }

export default function MisParcelas() {
  const online = useOnlineStatus()
  const [parcelas, setParcelas] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [resultadoIncierto, setResultadoIncierto] = useState(false)
  const intentoId = useRef(null)

  const cargar = useCallback(async (signal) => {
    setEstado('cargando')
    try {
      const datos = await listarParcelas({ signal })
      if (signal?.aborted) return
      setParcelas(datos)
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

  function abrir(parcela) {
    intentoId.current = null
    setErrors({})
    setMensaje('')
    setResultadoIncierto(false)
    setForm(parcela ? { id: parcela.id, nombre: parcela.nombre, superficieHa: String(parcela.superficieHa), ubicacionReferencia: parcela.ubicacionReferencia || '' } : { ...vacia })
  }

  function cambiar(event) {
    const { name, value } = event.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setErrors((actual) => ({ ...actual, [name]: undefined }))
    setMensaje('')
  }

  async function guardar(event) {
    event.preventDefault()
    const validacion = validarParcela(form)
    setErrors(validacion)
    if (Object.keys(validacion).length || guardando) return
    if (!online) { setMensaje('Para guardar parcelas necesitas conexión a Internet.'); return }
    setGuardando(true)
    setMensaje('')
    const datos = { nombre: form.nombre.trim(), superficieHa: Number(form.superficieHa), ubicacionReferencia: form.ubicacionReferencia.trim() || null }
    try {
      if (form.id) await editarParcela(form.id, datos)
      else {
        intentoId.current ||= crypto.randomUUID()
        await registrarParcela({ ...datos, idLocal: intentoId.current })
      }
      intentoId.current = null
      setForm(null)
      setMensaje('Parcela guardada correctamente.')
      await cargar()
    } catch (error) {
      if (error.status === 409) setErrors({ nombre: 'Ya tienes una parcela con ese nombre.' })
      else if (error.status === 400 && Object.keys(error.errors || {}).length) {
        const mapped = {}
        for (const [key, value] of Object.entries(error.errors)) {
          const field = key.charAt(0).toLowerCase() + key.slice(1)
          if (field in vacia) mapped[field] = Array.isArray(value) ? value[0] : value
        }
        setErrors(mapped)
        if (!Object.keys(mapped).length) setMensaje(error.message)
      } else if (!form.id && error.status === 0) {
        setResultadoIncierto(true)
        setMensaje('No se pudo confirmar si la parcela se guardó. Reintenta sin cambiar los datos o cancela y revisa la lista.')
      } else setMensaje(error.message || 'No fue posible guardar la parcela.')
    } finally { setGuardando(false) }
  }

  const campo = (name, label, props = {}) => <BaseField id={`parcela-${name}`} name={name} label={label} value={form[name]} onChange={cambiar} error={errors[name]} disabled={resultadoIncierto || guardando} {...props} />

  return <BaseCard className="stack">
    <div className="row row--between"><h2>Mis parcelas</h2>{!form && <BaseButton onClick={() => abrir(null)}>+ Agregar parcela</BaseButton>}</div>
    {mensaje && <AlertMessage title={form ? 'Información' : 'Parcelas'} tone={form ? 'warning' : 'info'}>{mensaje}</AlertMessage>}
    {form && <form className="form-grid" onSubmit={guardar} noValidate>
      <h3>{form.id ? 'Editar parcela' : 'Nueva parcela'}</h3>
      {campo('nombre', 'Nombre *', { maxLength: 80, required: true })}
      {campo('superficieHa', 'Superficie en hectáreas *', { type: 'text', inputMode: 'decimal', required: true, placeholder: 'Ej. 1.5' })}
      {campo('ubicacionReferencia', 'Ubicación o referencia (opcional)', { maxLength: 150 })}
      <div className="form-actions"><BaseButton variant="secondary" disabled={guardando} onClick={() => { setForm(null); setMensaje(''); setResultadoIncierto(false); cargar() }}>Cancelar</BaseButton><BaseButton type="submit" disabled={guardando}>{guardando ? 'Guardando…' : resultadoIncierto ? 'Reintentar guardado' : 'Guardar parcela'}</BaseButton></div>
    </form>}
    {estado === 'cargando' && <p role="status">Cargando parcelas…</p>}
    {estado === 'error' && <AlertMessage title="No se pudieron cargar tus parcelas" tone="warning">Verifica tu conexión e intenta nuevamente. <BaseButton variant="secondary" onClick={() => cargar()}>Reintentar</BaseButton></AlertMessage>}
    {estado === 'listo' && (parcelas.length ? <div className="stack">{parcelas.map((parcela) => <div className="row row--between" key={parcela.id}><div><strong>{parcela.nombre}</strong><p className="muted">{parcela.superficieHa} ha · {parcela.numeroCultivos} {parcela.numeroCultivos === 1 ? 'cultivo' : 'cultivos'}{parcela.ubicacionReferencia ? ` · ${parcela.ubicacionReferencia}` : ''}</p></div><BaseButton variant="secondary" onClick={() => abrir(parcela)}>Editar</BaseButton></div>)}</div> : <p className="muted">Aún no tienes parcelas registradas.</p>)}
  </BaseCard>
}
