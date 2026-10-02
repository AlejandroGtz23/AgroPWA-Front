import { useNavigate } from 'react-router-dom'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'

export default function CropFormPage() {
  const navigate = useNavigate()
  return <div className="page-shell"><div className="page-heading"><span className="eyebrow">P06 · Nuevo cultivo</span><h1>Nuevo cultivo</h1><p>Completa la información básica.</p></div><BaseCard><form className="form-grid" onSubmit={(e) => { e.preventDefault(); navigate('/app/cultivos') }}><BaseField label="Nombre del cultivo *" placeholder="Ej. Maíz criollo" required /><BaseField label="Tipo de cultivo *" as="select" defaultValue=""><option value="" disabled>Seleccionar tipo</option><option>Maíz</option><option>Frijol</option><option>Calabaza</option></BaseField><BaseField label="Fecha de siembra *" type="date" required /><BaseField label="Parcela o ubicación" placeholder="Ej. Parcela Norte" /><BaseField label="Observaciones" as="textarea" placeholder="Información adicional" /><AlertMessage title="Disponible sin conexión" tone="warning">El cultivo se guardará localmente hasta recuperar Internet.</AlertMessage><div className="form-actions"><BaseButton variant="secondary" onClick={() => navigate(-1)}>Cancelar</BaseButton><BaseButton type="submit">Guardar cultivo</BaseButton></div></form></BaseCard></div>
}
