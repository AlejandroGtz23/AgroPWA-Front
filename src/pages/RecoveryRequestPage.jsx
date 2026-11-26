import { useState } from 'react'
import { Link } from 'react-router-dom'
import { solicitarRecuperacionContrasena } from '../api/cliente'
import { AuthShell } from './LoginPage'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import useOnlineStatus from '../hooks/useOnlineStatus'

export default function RecoveryRequestPage() {
  const online = useOnlineStatus()
  const [correo, setCorreo] = useState('')
  const [tocado, setTocado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [solicitudEnviada, setSolicitudEnviada] = useState(false)
  const [error, setError] = useState('')
  const correoError = !correo.trim()
    ? 'Escribe el correo asociado a tu cuenta.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
      ? 'Revisa el formato del correo; por ejemplo, nombre@dominio.com.'
      : ''

  async function submit(event) {
    event.preventDefault()
    setTocado(true)
    setError('')
    if (correoError || enviando) return
    if (!online) {
      setError('Conéctate a Internet para solicitar el enlace. El correo que escribiste se conservará.')
      return
    }

    setEnviando(true)
    try {
      await solicitarRecuperacionContrasena(correo.trim())
      setSolicitudEnviada(true)
    } catch (requestError) {
      if (requestError.status === 429) {
        setError('Has solicitado varios enlaces recientemente. Espera un momento antes de intentarlo otra vez.')
      } else if (requestError.status === 0) {
        setError('No logramos conectar con Agro. Revisa tu conexión y vuelve a solicitar el enlace.')
      } else {
        setError('No pudimos completar la solicitud en este momento. Inténtalo de nuevo en unos minutos; no se cambió tu contraseña.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthShell title="Recupera el acceso a tu cuenta.">
      <BaseCard className="auth-card stack">
        <span className="eyebrow">Recuperar contraseña</span>
        <h1>Te ayudamos a volver a entrar</h1>
        <p className="muted">Escribe el correo que usas en Agro. Te indicaremos cómo continuar.</p>
        {solicitudEnviada ? (
          <>
            <AlertMessage title="Revisa tu correo" tone="info">
              Si hay una cuenta asociada a este correo, recibirás instrucciones para recuperar el acceso. Revisa también tu carpeta de correo no deseado.
            </AlertMessage>
            <p className="muted">El enlace puede tardar unos minutos. Si no llega, verifica que escribiste el correo correcto y vuelve a solicitarlo.</p>
            <div className="form-actions">
              <BaseButton variant="secondary" onClick={() => setSolicitudEnviada(false)}>Usar otro correo</BaseButton>
              <Link to="/login"><BaseButton>Volver a iniciar sesión</BaseButton></Link>
            </div>
          </>
        ) : (
          <form className="form-grid" onSubmit={submit} noValidate>
            <BaseField
              id="recovery-email"
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(event) => { setCorreo(event.target.value); setError('') }}
              onBlur={() => setTocado(true)}
              error={tocado ? correoError : undefined}
              required
            />
            {!online && <AlertMessage title="Sin conexión" tone="warning">Conéctate a Internet para recibir el enlace de recuperación.</AlertMessage>}
            {error && <AlertMessage title="No se pudo enviar la solicitud" tone="danger">{error}</AlertMessage>}
            <BaseButton type="submit" disabled={enviando || !online} aria-busy={enviando}>
              {enviando ? 'Enviando solicitud…' : 'Enviar instrucciones'}
            </BaseButton>
            <Link to="/login">Volver a iniciar sesión</Link>
          </form>
        )}
      </BaseCard>
    </AuthShell>
  )
}
