import { Link, useNavigate } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'

export default function LoginPage() {
  const navigate = useNavigate()
  return <AuthShell title="Cultiva información, cosecha mejores decisiones.">
    <BaseCard className="auth-card">
      <span className="eyebrow">P02 · Acceso</span><h1>Bienvenido a Agro</h1><p className="muted">Accede a tu espacio de trabajo.</p>
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); navigate('/app') }}>
        <BaseField id="email" label="Correo o usuario" type="email" placeholder="usuario@ejemplo.com" required />
        <BaseField id="password" label="Contraseña" type="password" placeholder="••••••••" required />
        <BaseButton type="submit">Ingresar al dashboard</BaseButton>
      </form>
      <p className="muted">¿Aún no tienes cuenta? <Link to="/registro"><strong>Regístrate</strong></Link></p>
    </BaseCard>
  </AuthShell>
}

export function AuthShell({ title, children }) {
  return <main className="auth-page"><aside className="auth-page__aside"><Link className="brand" to="/"><span className="brand__mark" />AGRO</Link><h1>{title}</h1><p>Tu información permanece disponible aun sin conexión.</p></aside><section className="auth-page__form">{children}</section></main>
}
