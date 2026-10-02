import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'

export default function SyncPage() {
  return <div className="page-shell stack"><div className="page-heading"><span className="eyebrow">P10 · Sincronización</span><h1>Sincronización</h1><p>Control de datos guardados localmente.</p></div><AlertMessage title="3 elementos pendientes" tone="warning">Los datos permanecen seguros en este dispositivo.</AlertMessage>{[['Actividad de riego','Maíz criollo · 17:32'],['2 fotografías','Actividad de riego · 1.8 MB'],['Nuevo cultivo','Chile serrano · Parcela Tres']].map(([title,detail]) => <BaseCard key={title}><div className="row row--between"><div><h3>{title}</h3><p className="muted">{detail}</p></div><StatusTag tone="warning">Pendiente</StatusTag></div></BaseCard>)}<BaseButton>Reintentar sincronización</BaseButton></div>
}
