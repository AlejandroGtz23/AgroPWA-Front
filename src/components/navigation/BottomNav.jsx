import { NavLink } from 'react-router-dom'
import './navigation.css'

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación móvil">
      <NavLink to="/app" end>Inicio</NavLink>
      <NavLink to="/app/cultivos">Cultivos</NavLink>
      <NavLink to="/app/sincronizacion">Sincronizar</NavLink>
      <NavLink to="/app/perfil">Perfil</NavLink>
    </nav>
  )
}
