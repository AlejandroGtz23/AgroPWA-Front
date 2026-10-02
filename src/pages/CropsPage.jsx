import { Link } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'
import StatusTag from '../components/ui/StatusTag'

const crops = [['1','Maíz criollo','Parcela Norte · 96 días','success'],['2','Calabaza','Parcela Dos · 45 días','success'],['3','Frijol negro','Parcela Sur · Finalizado','neutral']]
export default function CropsPage() {
  return <div className="page-shell stack"><div className="page-heading"><span className="eyebrow">P05 · Mis cultivos</span><h1>Mis cultivos</h1><p>Consulta y administra tus registros.</p></div><BaseField label="Buscar" placeholder="Cultivo o parcela" /><Link to="/app/cultivos/nuevo"><BaseButton>+ Registrar nuevo cultivo</BaseButton></Link><div className="crop-list">{crops.map(([id,name,detail,tone]) => <Link key={id} to={`/app/cultivos/${id}`}><BaseCard><div className="row row--between"><div><h3>{name}</h3><p className="muted">{detail}</p></div><StatusTag tone={tone}>{tone === 'neutral' ? 'Finalizado' : 'Activo'}</StatusTag></div></BaseCard></Link>)}</div></div>
}
