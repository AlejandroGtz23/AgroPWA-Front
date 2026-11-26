import { useEffect, useState } from 'react'

export default function CultivoPortada({ src, tipo = 'Cultivo', compact = false, detail = false }) {
  const [errorCarga, setErrorCarga] = useState(false)
  useEffect(() => setErrorCarga(false), [src])
  const clases = `crop-cover${compact ? ' crop-cover--compact' : ''}${detail ? ' crop-cover--detail' : ''}`

  if (src && !errorCarga) {
    return <img className={clases} src={src} alt={`Fotografía de portada de ${tipo}`} onError={() => setErrorCarga(true)} loading={compact ? 'lazy' : 'eager'} />
  }
  return <div className={`crop-cover crop-cover--placeholder${compact ? ' crop-cover--compact' : ''}${detail ? ' crop-cover--detail' : ''}`} role="img" aria-label={`Fotografía de ${tipo} no disponible`}>
    <span className="crop-cover__sun" />
    <span className="crop-cover__field crop-cover__field--back" />
    <span className="crop-cover__field crop-cover__field--front" />
    <span className="crop-cover__label">{tipo}</span>
  </div>
}
