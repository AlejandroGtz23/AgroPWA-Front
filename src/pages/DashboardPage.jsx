import { Link } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'

export default function DashboardPage() {
  return <div className="page-shell stack">
    <div className="page-heading"><span className="eyebrow">P04 · Dashboard</span><h1>Hola, Alejandro</h1><p>Resumen general de tus cultivos.</p></div>
    <section className="stats-grid">{[['4','Cultivos'],['2','Pendientes'],['1','Por sincronizar']].map(([value,label]) => <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
    <div className="row"><Link to="/app/cultivos/nuevo"><BaseButton>+ Nuevo cultivo</BaseButton></Link><Link to="/app/cultivos/1/actividad"><BaseButton variant="secondary">+ Registrar actividad</BaseButton></Link></div>
    <BaseCard><div className="row row--between"><div><h3>Maíz criollo</h3><p className="muted">Parcela Norte · Sembrado 12/06/2026</p></div><StatusTag>Activo</StatusTag></div></BaseCard>
  </div>
}
