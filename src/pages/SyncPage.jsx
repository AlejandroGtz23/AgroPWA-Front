import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import StatusTag from '../components/ui/StatusTag'
import { Link } from 'react-router-dom'

export default function SyncPage() {
  return <div className="page-shell stack">
    <div className="page-heading"><span className="eyebrow">ESTADO DE TUS DATOS</span><h1>Sincronización</h1><p>Consulta qué funciones están disponibles actualmente.</p></div>
    <BaseCard className="sync-status-card">
      <div className="row row--between"><div><h2>Trabajo sin conexión</h2><p className="muted">La captura local y el envío automático todavía no están habilitados.</p></div><StatusTag tone="warning">En desarrollo</StatusTag></div>
      <p>Los cambios que realices requieren conexión y se envían directamente al servicio. Esta pantalla no muestra una cola real de elementos.</p>
    </BaseCard>
    <AlertMessage title="Antes de habilitar esta función" tone="info">Se debe definir cómo proteger la información local en dispositivos compartidos y cómo se procesarán los cambios al recuperar la conexión.</AlertMessage>
    <div><Link to="/app/cultivos"><BaseButton variant="secondary">Volver a mis cultivos</BaseButton></Link></div>
  </div>
}
