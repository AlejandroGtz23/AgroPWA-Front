import { NavLink } from 'react-router-dom'
import './navigation.css'

const links = [
  ['Inicio', '/app'],
  ['Mis cultivos', '/app/cultivos'],
  ['Sincronización', '/app/sincronizacion'],
  ['Perfil', '/app/perfil'],
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand"><span className="brand__mark" />AGRO</NavLink>
      <nav aria-label="Navegación principal">
        {links.map(([label, to]) => <NavLink key={to} to={to} end={to === '/app'}>{label}</NavLink>)}
      </nav>
      <small>Modo PWA · Sprint 1</small>
    </aside>
  )
}
