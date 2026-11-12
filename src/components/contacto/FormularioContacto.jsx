import { useState } from 'react'
import { enviarContacto } from '../../api/contacto.js'
import AlertMessage from '../ui/AlertMessage'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'
import BaseField from '../ui/BaseField'
import useOnlineStatus from '../../hooks/useOnlineStatus'

const inicial = { nombre: '', correo: '', asunto: '', mensaje: '' }

function validar(values) {
  const errores = {}
  if (!values.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!values.correo.trim()) errores.correo = 'El correo es obligatorio.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim())) errores.correo = 'Escribe un correo válido.'
  if (!values.mensaje.trim()) errores.mensaje = 'El mensaje es obligatorio.'
  else if (values.mensaje.length > 1000) errores.mensaje = 'El mensaje admite hasta 1000 caracteres.'
  return errores
}

const camposApi = { Nombre: 'nombre', Correo: 'correo', Asunto: 'asunto', Mensaje: 'mensaje' }

export default function FormularioContacto() {
  const online = useOnlineStatus()
  const [form, setForm] = useState(inicial)
  const [errors, setErrors] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [alerta, setAlerta] = useState(null)

  function cambiar(event) {
    const { name, value } = event.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setErrors((actual) => ({ ...actual, [name]: undefined }))
    setAlerta(null)
  }

  async function submit(event) {
    event.preventDefault()
    const validacion = validar(form)
    setErrors(validacion)
    if (Object.keys(validacion).length || enviando) return
    if (!online) {
      setAlerta({ tono: 'warning', titulo: 'Sin conexión', texto: 'No hay conexión, intenta más tarde. Conservamos el texto que escribiste.' })
      return
    }

    setEnviando(true)
    setAlerta(null)
    try {
      await enviarContacto({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        asunto: form.asunto.trim() || null,
        mensaje: form.mensaje.trim(),
      })
      setForm(inicial)
      setErrors({})
      setAlerta({ tono: 'info', titulo: 'Mensaje enviado', texto: 'Mensaje enviado. Te responderemos pronto.' })
    } catch (error) {
      if (error.status === 400 && Object.keys(error.errors || {}).length) {
        const nuevos = {}
        Object.entries(error.errors).forEach(([campo, valor]) => {
          const nombre = camposApi[campo] || camposApi[campo.charAt(0).toUpperCase() + campo.slice(1)]
          if (nombre) nuevos[nombre] = Array.isArray(valor) ? valor[0] : valor
        })
        setErrors(nuevos)
      }
      const texto = error.status === 429
        ? 'Ya enviaste varios mensajes. Intenta más tarde.'
        : error.status === 0
          ? 'No fue posible conectar. Revisa tu conexión e intenta más tarde; conservamos el texto.'
          : error.message || 'No fue posible enviar tu mensaje. Intenta más tarde.'
      setAlerta({ tono: 'danger', titulo: 'No se pudo enviar el mensaje', texto })
    } finally { setEnviando(false) }
  }

  return <div className="contact-section__grid">
    <div className="contact-section__info">
      <span className="eyebrow">CONTÁCTANOS</span>
      <h2>¿Tienes dudas o sugerencias?</h2>
      <p>Escríbenos y con gusto te ayudamos a empezar.</p>
      <dl className="contact-details">
        <div><dt><span aria-hidden="true">@</span> Correo</dt><dd><a href="mailto:contacto@agro-app.mx">contacto@agro-app.mx</a></dd></div>
        <div><dt><span aria-hidden="true">⌖</span> Ubicación</dt><dd>Tula de Allende, Hidalgo, México</dd></div>
        <div><dt><span aria-hidden="true">◷</span> Horario de atención</dt><dd>Lunes a viernes, 9:00 – 17:00</dd></div>
      </dl>
    </div>
    <BaseCard className="contact-form-card">
      <form className="form-grid contact-form" onSubmit={submit} noValidate>
        <BaseField id="contacto-nombre" name="nombre" label="Nombre completo *" placeholder="Ej. María López" value={form.nombre} onChange={cambiar} error={errors.nombre} maxLength={120} required disabled={enviando} />
        <BaseField id="contacto-correo" name="correo" label="Correo electrónico *" type="email" autoComplete="email" placeholder="nombre@correo.com" value={form.correo} onChange={cambiar} error={errors.correo} maxLength={254} required disabled={enviando} />
        <BaseField id="contacto-asunto" name="asunto" label="Asunto" as="select" value={form.asunto} onChange={cambiar} error={errors.asunto} disabled={enviando}>
          <option value="">Selecciona un asunto (opcional)</option><option value="Consulta">Consulta</option><option value="Sugerencia">Sugerencia</option><option value="Problema técnico">Problema técnico</option><option value="Otro">Otro</option>
        </BaseField>
        <div className="base-field"><label htmlFor="contacto-mensaje">Mensaje *</label><textarea id="contacto-mensaje" name="mensaje" value={form.mensaje} onChange={cambiar} maxLength={1000} disabled={enviando} aria-invalid={errors.mensaje ? true : undefined} aria-describedby="contacto-mensaje-ayuda" placeholder="Escribe tu mensaje…" required />{errors.mensaje && <small role="alert">{errors.mensaje}</small>}<small id="contacto-mensaje-ayuda" className="muted">{form.mensaje.length} / 1000 caracteres</small></div>
        {alerta && <AlertMessage title={alerta.titulo} tone={alerta.tono}>{alerta.texto}</AlertMessage>}
        {!online && <AlertMessage title="Sin conexión" tone="warning">El formulario requiere conexión; lo escrito se conservará.</AlertMessage>}
        <BaseButton type="submit" disabled={enviando || !online}>{enviando ? 'Enviando mensaje…' : 'Enviar mensaje'}</BaseButton>
        <small className="muted">Te responderemos en un máximo de 48 horas.</small>
      </form>
    </BaseCard>
  </div>
}
