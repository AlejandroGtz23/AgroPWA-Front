import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { restablecerContrasena } from '../api/cliente'
import { AuthShell } from './LoginPage'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import useOnlineStatus from '../hooks/useOnlineStatus'

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [tocado, setTocado] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [enlaceInvalido, setEnlaceInvalido] = useState(!token)

  const errores = {
    contrasena: contrasena.length < 8 ? 'Usa al menos 8 caracteres para tu nueva contraseña.' : '',
    confirmacion: confirmacion !== contrasena ? 'Las contraseñas no coinciden. Revisa ambas antes de continuar.' : '',
  }

  async function submit(event) {
    event.preventDefault()
    setTocado(true)
    setError('')
    if (!token || errores.contrasena || errores.confirmacion || guardando) return
    if (!online) {
      setError('Conéctate a Internet para cambiar tu contraseña. Tus datos siguen en este formulario.')
      return
    }

    setGuardando(true)
    try {
      await restablecerContrasena(token, contrasena)
      setContrasena('')
      setConfirmacion('')
      navigate('/login', { replace: true, state: { mensaje: 'Tu contraseña se actualizó. Inicia sesión con tu nueva contraseña.' } })
    } catch (requestError) {
      if ([400, 404].includes(requestError.status)) {
        setEnlaceInvalido(true)
        setError('Este enlace venció o ya se utilizó. Solicita uno nuevo para crear otra contraseña.')
      } else if (requestError.status === 0) {
        setError('No logramos conectar con Agro. Revisa tu conexión y vuelve a intentarlo; el enlace no se ha consumido por este error.')
      } else {
        setError('No pudimos actualizar la contraseña. Inténtalo de nuevo; si el enlace venció, solicita uno nuevo.')
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <AuthShell title="Crea una contraseña nueva y segura.">
      <BaseCard className="auth-card stack">
        <span className="eyebrow">Restablecer contraseña</span>
        <h1>Elige una contraseña nueva</h1>
        {!token || enlaceInvalido ? (
          <>
            <AlertMessage title="Este enlace no está disponible" tone="warning">
              {error || 'El enlace no incluye un código válido. Solicita uno nuevo para continuar.'}
            </AlertMessage>
            <Link to="/recuperar"><BaseButton>Solicitar otro enlace</BaseButton></Link>
          </>
        ) : (
          <form className="form-grid" onSubmit={submit} noValidate>
            <p className="muted">Usa al menos 8 caracteres. Por seguridad, no reutilices una contraseña que compartas con otras personas.</p>
            <BaseField
              id="new-password"
              label="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={contrasena}
              onChange={(event) => { setContrasena(event.target.value); setError('') }}
              onBlur={() => setTocado(true)}
              error={tocado ? errores.contrasena : undefined}
              required
            />
            <BaseField
              id="confirm-password"
              label="Confirma la nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={confirmacion}
              onChange={(event) => { setConfirmacion(event.target.value); setError('') }}
              onBlur={() => setTocado(true)}
              error={tocado ? errores.confirmacion : undefined}
              required
            />
            {!online && <AlertMessage title="Sin conexión" tone="warning">Conéctate a Internet para guardar la nueva contraseña.</AlertMessage>}
            {error && <AlertMessage title={enlaceInvalido ? 'Enlace vencido o utilizado' : 'No se pudo actualizar la contraseña'} tone="danger">{error}</AlertMessage>}
            <BaseButton type="submit" disabled={guardando || !online} aria-busy={guardando}>
              {guardando ? 'Actualizando contraseña…' : 'Guardar contraseña nueva'}
            </BaseButton>
            <Link to="/login">Volver a iniciar sesión</Link>
          </form>
        )}
      </BaseCard>
    </AuthShell>
  )
}
