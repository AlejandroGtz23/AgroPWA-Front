import { useEffect, useState } from 'react'
import BaseButton from '../ui/BaseButton'

const maxEntrada = 5 * 1024 * 1024

export default function SelectorFotoPortada({ archivo, src, onChange, disabled = false }) {
  const [url, setUrl] = useState(src || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!archivo) {
      setUrl(src || '')
      return undefined
    }
    const objectUrl = URL.createObjectURL(archivo)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [archivo, src])

  function seleccionar(event) {
    const seleccion = event.target.files?.[0]
    event.target.value = ''
    if (!seleccion) return
    if (!['image/jpeg', 'image/png'].includes(seleccion.type)) {
      setError('Solo se aceptan imágenes JPG o PNG.')
      onChange(null)
    } else if (!seleccion.size || seleccion.size > maxEntrada) {
      setError('La imagen debe tener un tamaño de hasta 5 MB.')
      onChange(null)
    } else {
      setError('')
      onChange(seleccion)
    }
  }

  return <div className="crop-photo-note">
    {url ? <img className="crop-photo-note__preview" src={url} alt="Vista previa de la foto de portada" /> : <span aria-hidden="true">▣</span>}
    <strong>{archivo ? 'Nueva foto de portada seleccionada' : src ? 'Foto de portada actual' : 'Foto de portada opcional'}</strong>
    <small>JPG o PNG · máximo 5 MB · se comprimirá antes de subirla</small>
    <label className="base-button base-button--secondary selector-foto__button">
      {src || archivo ? 'Elegir otra foto' : 'Elegir foto de portada'}
      <input className="visually-hidden" type="file" accept="image/jpeg,image/png" onChange={seleccionar} disabled={disabled} />
    </label>
    {error && <small role="alert">{error}</small>}
  </div>
}
