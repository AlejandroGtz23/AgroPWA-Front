import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'

export default function ProfilePage() {
  return <div className="page-shell"><div className="page-heading"><span className="eyebrow">P11 · Perfil</span><h1>Mi perfil</h1><p>Administra la información de tu cuenta.</p></div><BaseCard><form className="form-grid" onSubmit={(e) => e.preventDefault()}><BaseField label="Nombre completo" defaultValue="Alejandro Gutiérrez" /><BaseField label="Correo" type="email" defaultValue="usuario@ejemplo.com" /><BaseField label="Rol" defaultValue="Productor" disabled /><BaseButton type="submit">Guardar cambios</BaseButton></form></BaseCard></div>
}
