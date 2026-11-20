import BaseCard from '../components/ui/BaseCard'
import CerrarSesion from '../components/navigation/CerrarSesion'
import MisParcelas from '../components/parcelas/MisParcelas'
import AlertMessage from '../components/ui/AlertMessage'
import { obtenerSesion } from '../auth/sesion'

export default function ProfilePage() {
  const usuario = obtenerSesion()?.usuario || {}
  const nombre = usuario.nombreCompleto || [usuario.nombre, usuario.apellidoPaterno, usuario.apellidoMaterno].filter(Boolean).join(' ')
  const correo = usuario.correo || usuario.email
  return <div className="page-shell stack">
    <div className="page-heading"><span className="eyebrow">TU CUENTA</span><h1>Mi perfil</h1><p>Consulta la información asociada a tu sesión.</p></div>
    <AlertMessage title="Edición de perfil no disponible" tone="info">Por ahora puedes consultar los datos devueltos al iniciar sesión. La edición del perfil todavía no está conectada a la API.</AlertMessage>
    <BaseCard className="profile-card">
      <div className="profile-card__intro"><span className="profile-avatar" aria-hidden="true">{(nombre || correo || 'A').slice(0, 1).toUpperCase()}</span><div><h2>{nombre || 'Productor Agro'}</h2><p className="muted">Información de tu cuenta</p></div></div>
      <div className="profile-card__details">
        <div><span>Nombre completo</span><strong>{nombre || 'No disponible'}</strong></div>
        <div><span>Correo electrónico</span><strong>{correo || 'No disponible'}</strong></div>
        <div><span>Estado de sesión</span><strong>Activa</strong></div>
      </div>
    </BaseCard>
    <MisParcelas />
    <CerrarSesion />
  </div>
}
