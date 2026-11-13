import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { obtenerDetalleCultivo } from '../api/cultivos'
import { subirFotografia } from '../api/fotografias'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import { comprimirFotografia } from '../components/cultivos/comprimirFotografia'
import useOnlineStatus from '../hooks/useOnlineStatus'

const maxFotos = 5
const maxEntradaBytes = 5 * 1024 * 1024

function VistaPrevia({ archivo }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const objectUrl = URL.createObjectURL(archivo)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [archivo])
  return url ? <img src={url} alt={`Vista previa de ${archivo.name}`} /> : null
}

function contarFotos(avance, fotografias) {
  const asociadas = fotografias.filter((foto) => String(foto.idAvance ?? foto.avanceId ?? '') === String(avance.id)).length
  const valor = Array.isArray(avance.fotos) ? avance.fotos.length : Number(avance.fotos) || 0
  return Math.max(asociadas, valor)
}

export default function PhotosPage() {
  const { activityId } = useParams()
  const [searchParams] = useSearchParams()
  const cropId = searchParams.get('cultivo')
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const cameraInput = useRef(null)
  const galleryInput = useRef(null)
  const [detalle, setDetalle] = useState(null)
  const [avance, setAvance] = useState(null)
  const [fotosExistentes, setFotosExistentes] = useState(0)
  const [archivos, setArchivos] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [mensaje, setMensaje] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  useEffect(() => {
    if (!cropId) {
      setEstado('sin-contexto')
      return undefined
    }
    const controller = new AbortController()
    obtenerDetalleCultivo(cropId, { signal: controller.signal }).then((data) => {
      if (controller.signal.aborted) return
      const encontrado = (data.avances || []).find((item) => String(item.id) === String(activityId))
      if (!encontrado) {
        setEstado('no-encontrado')
        return
      }
      setDetalle(data)
      setAvance(encontrado)
      setFotosExistentes(contarFotos(encontrado, data.fotografias || []))
      setEstado('listo')
    }).catch((error) => {
      if (!controller.signal.aborted) {
        setMensaje(error.status === 404 ? 'No encontramos el cultivo o el avance.' : error.message || 'No se pudieron cargar los datos del avance.')
        setEstado('error')
      }
    })
    return () => controller.abort()
  }, [activityId, cropId])

  const bloqueadas = useMemo(() => archivos.length + fotosExistentes >= maxFotos, [archivos.length, fotosExistentes])

  function agregarArchivos(lista) {
    setMensaje('')
    const nuevos = []
    for (const archivo of Array.from(lista || [])) {
      if (!['image/jpeg', 'image/png'].includes(archivo.type)) {
        setMensaje('Solo se aceptan imágenes JPG o PNG.')
        continue
      }
      if (archivo.size === 0 || archivo.size > maxEntradaBytes) {
        setMensaje('Cada imagen debe tener un tamaño de hasta 5 MB.')
        continue
      }
      if (fotosExistentes + archivos.length + nuevos.length >= maxFotos) {
        setMensaje('Un avance admite como máximo 5 fotografías.')
        break
      }
      nuevos.push({ key: crypto.randomUUID(), archivo, estado: 'pendiente', error: '' })
    }
    if (nuevos.length) setArchivos((actuales) => [...actuales, ...nuevos])
  }

  function quitarArchivo(key) {
    setArchivos((actuales) => actuales.filter((item) => item.key !== key))
  }

  async function adjuntar() {
    if (!online) {
      setMensaje('No hay conexión. Las fotografías no se guardarán en este dispositivo; el almacenamiento offline requiere acordar el aislamiento por usuario.')
      return
    }
    if (subiendo) return
    const pendientes = archivos.filter((item) => item.estado !== 'listo')
    if (!pendientes.length) {
      navigate(`/app/cultivos/${cropId}`, { replace: true, state: { mensajeFotos: 'Fotografías guardadas correctamente.' } })
      return
    }

    setSubiendo(true)
    setMensaje('')
    for (const item of pendientes) {
      setArchivos((actuales) => actuales.map((actual) => actual.key === item.key ? { ...actual, estado: 'subiendo', error: '' } : actual))
      try {
        const comprimida = await comprimirFotografia(item.archivo)
        await subirFotografia(cropId, comprimida, { idAvance: activityId, idLocal: item.key })
        setArchivos((actuales) => actuales.map((actual) => actual.key === item.key ? { ...actual, estado: 'listo', error: '' } : actual))
      } catch (error) {
        setArchivos((actuales) => actuales.map((actual) => actual.key === item.key ? { ...actual, estado: 'error', error: error.message } : actual))
      }
    }
    setSubiendo(false)
  }

  const completadas = archivos.filter((item) => item.estado === 'listo').length
  const listasTodas = archivos.length > 0 && completadas === archivos.length

  return <div className="page-shell stack">
    <div className="crop-form-heading"><Link to={cropId ? `/app/cultivos/${cropId}` : '/app/cultivos'} aria-label="Volver al cultivo">←</Link><div><span className="eyebrow">P09 · Fotografías</span><h1>Agregar evidencia</h1></div></div>
    {estado === 'cargando' && <p role="status">Cargando avance…</p>}
    {estado === 'sin-contexto' && <AlertMessage title="Falta información del avance" tone="warning">Abre esta pantalla desde el detalle del cultivo para asociar las fotografías al avance correcto.</AlertMessage>}
    {estado === 'no-encontrado' && <AlertMessage title="Avance no encontrado" tone="warning">Vuelve al detalle del cultivo y selecciona un avance existente.</AlertMessage>}
    {estado === 'error' && <AlertMessage title="No se pudo cargar el avance" tone="warning">{mensaje}</AlertMessage>}
    {estado === 'listo' && <>
      <div className="page-heading"><p>{detalle.cultivo.nombre} · {avance.tipo || 'Actividad'}</p><p className="muted">{avance.descripcion}</p></div>
      {!online && <AlertMessage title="Sin conexión" tone="warning">Las fotografías no se guardarán en este dispositivo. El uso offline requiere acordar el aislamiento de datos por usuario.</AlertMessage>}
      {mensaje && <AlertMessage title="No se pudo adjuntar una fotografía" tone="warning">{mensaje}</AlertMessage>}
      <BaseCard className="stack">
        <p className="muted">{fotosExistentes + archivos.length} de {maxFotos} fotografías</p>
        <div className="photo-grid">
          {archivos.map((item) => <figure className="activity-photo" key={item.key}>
            <VistaPrevia archivo={item.archivo} />
            <figcaption>{item.archivo.name}{item.estado === 'subiendo' ? ' · Subiendo…' : item.estado === 'listo' ? ' · Adjuntada' : ''}</figcaption>
            {item.error && <small role="alert">{item.error}</small>}
            {item.estado !== 'subiendo' && item.estado !== 'listo' && <BaseButton type="button" variant="ghost" onClick={() => quitarArchivo(item.key)}>Quitar</BaseButton>}
          </figure>)}
          {archivos.length === 0 && <p className="muted">Aún no has seleccionado fotografías.</p>}
        </div>
        <div className="row activity-photo__pickers">
          <BaseButton type="button" variant="secondary" disabled={bloqueadas || !online || estado !== 'listo'} onClick={() => cameraInput.current?.click()}>Tomar foto</BaseButton>
          <BaseButton type="button" variant="secondary" disabled={bloqueadas || !online || estado !== 'listo'} onClick={() => galleryInput.current?.click()}>Subir desde galería</BaseButton>
          <input ref={cameraInput} className="visually-hidden" type="file" accept="image/jpeg,image/png" capture="environment" onChange={(event) => { agregarArchivos(event.target.files); event.target.value = '' }} />
          <input ref={galleryInput} className="visually-hidden" type="file" accept="image/jpeg,image/png" multiple onChange={(event) => { agregarArchivos(event.target.files); event.target.value = '' }} />
        </div>
        <p className="muted">JPG o PNG · hasta 5 MB por archivo · se comprimen antes de subirlas.</p>
        <div className="form-actions">
          <BaseButton variant="secondary" disabled={subiendo} onClick={() => navigate(`/app/cultivos/${cropId}`)}>Volver al cultivo</BaseButton>
          {archivos.length > 0 && <BaseButton disabled={subiendo || !online} onClick={listasTodas ? () => navigate(`/app/cultivos/${cropId}`, { replace: true, state: { mensajeFotos: 'Fotografías guardadas correctamente.' } }) : adjuntar}>{subiendo ? 'Subiendo…' : listasTodas ? 'Terminar' : 'Adjuntar fotos'}</BaseButton>}
        </div>
      </BaseCard>
    </>}
  </div>
}
