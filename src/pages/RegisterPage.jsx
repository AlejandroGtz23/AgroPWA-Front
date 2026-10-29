import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../api/cliente'
import { guardarSesion } from '../auth/sesion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import useOnlineStatus from '../hooks/useOnlineStatus'
import { AuthShell } from './LoginPage'

const initialValues = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', correo: '', telefono: '', fechaNacimiento: '', contrasena: '', confirmacion: '', aceptaTerminos: false }

function validate(values) {
  const errors = {}
  for (const [key, label] of [['nombre', 'nombre'], ['apellidoPaterno', 'apellido paterno']]) {
    if (!values[key].trim()) errors[key] = `El ${label} es obligatorio.`
    else if (values[key].trim().length < 2) errors[key] = `El ${label} debe tener al menos 2 letras.`
    else if (values[key].length > 60) errors[key] = 'Máximo 60 caracteres.'
  }
  if (values.apellidoMaterno.length > 60) errors.apellidoMaterno = 'Máximo 60 caracteres.'
  if (!values.correo.trim()) errors.correo = 'El correo es obligatorio.'
  else if (values.correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim())) errors.correo = 'Escribe un correo válido.'
  if (values.telefono.trim() && !/^[0-9]{10}$/.test(values.telefono.trim())) errors.telefono = 'El teléfono debe tener 10 dígitos.'
  const today = new Date().toISOString().slice(0, 10)
  if (!values.fechaNacimiento) errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
  else if (values.fechaNacimiento < '1900-01-01' || values.fechaNacimiento >= today) errors.fechaNacimiento = 'Ingresa una fecha de nacimiento válida.'
  if (!values.contrasena) errors.contrasena = 'La contraseña es obligatoria.'
  else if (values.contrasena.length < 8 || values.contrasena.length > 72) errors.contrasena = 'La contraseña debe tener entre 8 y 72 caracteres.'
  if (!values.confirmacion) errors.confirmacion = 'Confirma tu contraseña.'
  else if (values.confirmacion !== values.contrasena) errors.confirmacion = 'Las contraseñas no coinciden.'
  if (!values.aceptaTerminos) errors.aceptaTerminos = 'Debes aceptar los términos y el aviso de privacidad.'
  return errors
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [serverErrors, setServerErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  const errors = validate(values)

  function update(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setTouched((current) => ({ ...current, [name]: true }))
    setServerErrors((current) => ({ ...current, [name]: undefined }))
    setMessage('')
  }

  function fieldError(name) {
    return serverErrors[name] || (touched[name] && errors[name]) || undefined
  }

  async function submit(event) {
    event.preventDefault()
    setTouched(Object.fromEntries(Object.keys(initialValues).map((key) => [key, true])))
    if (Object.keys(errors).length || submitting) return
    if (!online) { setMessage('El registro requiere conexión a Internet.'); return }
    setSubmitting(true)
    setMessage('')
    try {
      const { confirmacion, ...datos } = values
      const sesion = await registrarUsuario({ ...datos, nombre: datos.nombre.trim(), apellidoPaterno: datos.apellidoPaterno.trim(), apellidoMaterno: datos.apellidoMaterno.trim() || null, correo: datos.correo.trim(), telefono: datos.telefono.trim() || null })
      try {
        guardarSesion(sesion)
      } catch {
        setAccountCreated(true)
        setMessage('La cuenta se creó, pero no fue posible guardar la sesión. Inicia sesión para continuar.')
        return
      }
      navigate('/app', { replace: true })
    } catch (error) {
      if (error.status === 409) setServerErrors({ correo: 'Este correo ya está registrado.' })
      else if (error.status === 400 && Object.keys(error.errors || {}).length) {
        const mapped = {}
        for (const [key, messages] of Object.entries(error.errors)) {
          const field = key.charAt(0).toLowerCase() + key.slice(1)
          if (field in initialValues) mapped[field] = Array.isArray(messages) ? messages[0] : messages
        }
        setServerErrors(mapped)
        if (!Object.keys(mapped).length) setMessage(error.message)
      } else setMessage(error.message || 'No fue posible completar el registro.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name, label, props = {}) => <BaseField id={`registro-${name}`} name={name} label={label} value={values[name]} onChange={update} onBlur={() => setTouched((current) => ({ ...current, [name]: true }))} error={fieldError(name)} {...props} />

  return <AuthShell title="Comienza a organizar tus cultivos.">
    <BaseCard className="auth-card">
      <span className="eyebrow">P03 · Registro</span><h1>Crear cuenta</h1><p className="muted">Completa tus datos para comenzar como productor.</p>
      <form className="form-grid" onSubmit={submit} noValidate>
        {field('nombre', 'Nombre *', { autoComplete: 'given-name', maxLength: 60, required: true })}
        {field('apellidoPaterno', 'Apellido paterno *', { maxLength: 60, required: true })}
        {field('apellidoMaterno', 'Apellido materno (opcional)', { maxLength: 60 })}
        {field('correo', 'Correo electrónico *', { type: 'email', autoComplete: 'email', maxLength: 150, required: true })}
        {field('telefono', 'Teléfono (opcional)', { type: 'tel', inputMode: 'numeric', autoComplete: 'tel', maxLength: 10 })}
        {field('fechaNacimiento', 'Fecha de nacimiento *', { type: 'date', autoComplete: 'bday', required: true })}
        {field('contrasena', 'Contraseña *', { type: 'password', autoComplete: 'new-password', maxLength: 72, required: true })}
        {field('confirmacion', 'Confirmar contraseña *', { type: 'password', autoComplete: 'new-password', maxLength: 72, required: true })}
        <div className="terms-field"><label><input type="checkbox" name="aceptaTerminos" checked={values.aceptaTerminos} onChange={update} aria-invalid={fieldError('aceptaTerminos') ? true : undefined} aria-describedby={fieldError('aceptaTerminos') ? 'terminos-error' : undefined} /> Acepto los términos de uso y el aviso de privacidad *</label>{fieldError('aceptaTerminos') && <small id="terminos-error" role="alert">{fieldError('aceptaTerminos')}</small>}</div>
        {!online && <AlertMessage title="Sin conexión" tone="warning">El registro requiere conexión a Internet.</AlertMessage>}
        {message && <AlertMessage title="No se pudo completar la sesión" tone="danger">{message}</AlertMessage>}
        <BaseButton type="submit" disabled={accountCreated || submitting || Object.keys(errors).some((name) => touched[name])}>{submitting ? 'Creando cuenta…' : 'Crear cuenta'}</BaseButton>
      </form>
      <p className="muted">¿Ya tienes cuenta? <Link to="/login"><strong>Inicia sesión</strong></Link></p>
    </BaseCard>
  </AuthShell>
}
