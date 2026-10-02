import { Link } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'

export default function CropDetailPage() {
  return <div className="page-shell stack"><div className="page-heading"><span className="eyebrow">P07 · Detalle</span><h1>Maíz criollo</h1><p>Parcela Norte</p></div><BaseCard><span className="eyebrow">Estado del cultivo</span><h2>96 días desde la siembra</h2><p className="muted">Última actividad: riego · hoy</p></BaseCard><Link to="/app/cultivos/1/actividad"><BaseButton>+ Registrar actividad</BaseButton></Link><h2>Historial</h2>{[['Riego','18/09/2026 · 40 minutos','Hoy'],['Fertilización','12/09/2026 · Fertilizante orgánico','Hace 6 días'],['Avance general','05/09/2026 · Crecimiento uniforme','Hace 13 días']].map(([name,detail,tag]) => <BaseCard key={name}><div className="row row--between"><div><h3>{name}</h3><p className="muted">{detail}</p></div><StatusTag>{tag}</StatusTag></div></BaseCard>)}</div>
}
