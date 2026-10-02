import { useNavigate } from 'react-router-dom'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'

export default function PhotosPage() {
  const navigate = useNavigate()
  return <div className="page-shell"><div className="page-heading"><span className="eyebrow">P09 · Fotografías</span><h1>Agregar evidencia</h1><p>Actividad de riego</p></div><BaseCard className="stack"><div className="photo-grid"><div className="photo-placeholder" /><div className="photo-placeholder" /></div><BaseButton variant="secondary">+ Tomar o elegir otra fotografía</BaseButton><AlertMessage title="Compresión automática">Las imágenes se optimizarán antes de sincronizarse.</AlertMessage><div className="form-actions"><BaseButton variant="secondary" onClick={() => navigate(-1)}>Cancelar</BaseButton><BaseButton onClick={() => navigate('/app/sincronizacion')}>Adjuntar fotos</BaseButton></div></BaseCard></div>
}
