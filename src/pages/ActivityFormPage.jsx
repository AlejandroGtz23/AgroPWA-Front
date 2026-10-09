import { useNavigate } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseField from '../components/ui/BaseField'

export default function ActivityFormPage() {
  const navigate = useNavigate()
  return <div className="page-shell"><div className="page-heading"><span className="eyebrow">P08 · Actividad</span><h1>Registrar actividad</h1><p>Maíz criollo · Parcela Norte</p></div><BaseCard><form className="form-grid" onSubmit={(e) => { e.preventDefault(); navigate('/app/actividades/1/fotos') }}><BaseField label="Tipo de actividad *" as="select"><option>Riego</option><option>Fertilización</option><option>Avance</option></BaseField><BaseField label="Fecha *" type="date" required /><BaseField label="Descripción u observaciones *" as="textarea" placeholder="Describe la actividad" required /><BaseButton type="submit">Continuar con fotografías</BaseButton></form></BaseCard></div>
}
