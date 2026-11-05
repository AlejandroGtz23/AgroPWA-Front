export default function CultivoPortada({ src, tipo = 'Cultivo', compact = false }) {
  if (src) return <img className={`crop-cover${compact ? ' crop-cover--compact' : ''}`} src={src} alt={`Fotografía de ${tipo}`} />
  return <div className={`crop-cover crop-cover--placeholder${compact ? ' crop-cover--compact' : ''}`} role="img" aria-label={`Fotografía de ${tipo} no disponible`}>
    <span className="crop-cover__sun" />
    <span className="crop-cover__field crop-cover__field--back" />
    <span className="crop-cover__field crop-cover__field--front" />
    <span className="crop-cover__label">{tipo}</span>
  </div>
}
