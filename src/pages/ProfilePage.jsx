import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import CerrarSesion from '../components/navigation/CerrarSesion'
import MisParcelas from '../components/parcelas/MisParcelas'
import AlertMessage from '../components/ui/AlertMessage'

export default function ProfilePage() {
  return <div className="page-shell stack"><div className="page-heading"><span className="eyebrow">P11 · Perfil</span><h1>Mi perfil</h1><p>Administra la información de tu cuenta.</p></div><AlertMessage title="Datos personales de demostración" tone="info">La edición de perfil aún no está conectada a la API.</AlertMessage><BaseCard><form className="form-grid" onSubmit={(e) => e.preventDefault()}><BaseField label="Nombre completo" defaultValue="Alejandro Gutiérrez" /><BaseField label="Correo" type="email" defaultValue="usuario@ejemplo.com" /><BaseField label="Rol" defaultValue="Productor" disabled /><BaseButton type="submit" disabled>Guardar cambios</BaseButton></form></BaseCard><MisParcelas /><CerrarSesion /></div>
}
