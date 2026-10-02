import { Link } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'

export default function NotFoundPage() {
  return <main className="page-shell" style={{ minHeight: '100vh', display: 'grid', placeContent: 'center', textAlign: 'center' }}><span className="eyebrow">P12 · Estado del sistema</span><h1>Página no encontrada</h1><p className="muted">La ruta solicitada no existe o todavía no está disponible.</p><Link to="/"><BaseButton>Volver al inicio</BaseButton></Link></main>
}
