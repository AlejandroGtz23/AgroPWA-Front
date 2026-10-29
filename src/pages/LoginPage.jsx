import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../api/cliente'
import { guardarSesion } from '../auth/sesion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import useOnlineStatus from '../hooks/useOnlineStatus'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const online = useOnlineStatus()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [recordarme, setRecordarme] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [correoTocado, setCorreoTocado] = useState(false)
  const [contrasenaTocada, setContrasenaTocada] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const correoError = !correo.trim() ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ? 'Escribe un correo válido.' : ''

  async function submit(event) {
    event.preventDefault()
    setCorreoTocado(true)
    setContrasenaTocada(true)
    if (correoError || !contrasena || enviando) return
    if (!online) { setMensaje('Iniciar sesión requiere conexión a Internet.'); return }
    setEnviando(true)
    setMensaje('')
    try {
      const sesion = await iniciarSesion({ correo: correo.trim(), contrasena, recordarme })
      guardarSesion(sesion, recordarme)
      navigate('/app', { replace: true })
    } catch (error) {
      setMensaje(error.status === 401 ? 'Correo o contraseña incorrectos.' : error.status === 429 ? (error.message || 'Demasiados intentos. Intenta más tarde.') : (error.message || 'No fue posible iniciar sesión.'))
    } finally { setEnviando(false) }
  }

  return <AuthShell title="Cultiva información, cosecha mejores decisiones.">
    <BaseCard className="auth-card">
      <span className="eyebrow">P02 · Acceso</span><h1>Bienvenido a Agro</h1><p className="muted">Accede a tu espacio de trabajo.</p>
      {location.state?.mensaje && <AlertMessage title="Sesión">{location.state.mensaje}</AlertMessage>}
      <form className="form-grid" onSubmit={submit} noValidate>
        <BaseField id="email" label="Correo" type="email" autoComplete="email" value={correo} onChange={(event) => setCorreo(event.target.value)} onBlur={() => setCorreoTocado(true)} error={correoTocado ? correoError : undefined} required />
        <BaseField id="password" label="Contraseña" type={mostrar ? 'text' : 'password'} autoComplete="current-password" value={contrasena} onChange={(event) => setContrasena(event.target.value)} onBlur={() => setContrasenaTocada(true)} error={contrasenaTocada && !contrasena ? 'La contraseña es obligatoria.' : undefined} required />
        <label className="auth-option"><input type="checkbox" checked={mostrar} onChange={(event) => setMostrar(event.target.checked)} /> Mostrar contraseña</label>
        <label className="auth-option"><input type="checkbox" checked={recordarme} onChange={(event) => setRecordarme(event.target.checked)} /> Recordarme en este dispositivo</label>
        {!online && <AlertMessage title="Sin conexión" tone="warning">Iniciar sesión requiere conexión a Internet.</AlertMessage>}
        {mensaje && <AlertMessage title="No se pudo iniciar sesión" tone="danger">{mensaje}</AlertMessage>}
        <BaseButton type="submit" disabled={enviando}>{enviando ? 'Iniciando sesión…' : 'Iniciar sesión'}</BaseButton>
      </form>
      <p className="muted">¿Olvidaste tu contraseña? <small>Recuperación próximamente.</small></p>
      <p className="muted">¿Aún no tienes cuenta? <Link to="/registro"><strong>Regístrate</strong></Link></p>
    </BaseCard>
  </AuthShell>
}

export function AuthShell({ title, children }) {
  return <main className="auth-page"><aside className="auth-page__aside"><Link className="brand" to="/"><span className="brand__mark" />AGRO</Link><h1>{title}</h1><p>Organiza y consulta la información de tus cultivos.</p></aside><section className="auth-page__form">{children}</section></main>
}
