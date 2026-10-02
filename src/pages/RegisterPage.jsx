import { Link, useNavigate } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import { AuthShell } from './LoginPage'

export default function RegisterPage() {
  const navigate = useNavigate()
  return <AuthShell title="Comienza a organizar tus cultivos.">
    <BaseCard className="auth-card">
      <span className="eyebrow">P03 · Registro</span><h1>Crear cuenta</h1><p className="muted">Completa tus datos para comenzar.</p>
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); navigate('/app') }}>
        <BaseField id="name" label="Nombre completo" placeholder="Nombre y apellidos" required />
        <BaseField id="register-email" label="Correo" type="email" placeholder="usuario@ejemplo.com" required />
        <BaseField id="register-password" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" required />
        <BaseButton type="submit">Crear cuenta</BaseButton>
      </form>
      <p className="muted">¿Ya tienes cuenta? <Link to="/login"><strong>Inicia sesión</strong></Link></p>
    </BaseCard>
  </AuthShell>
}
