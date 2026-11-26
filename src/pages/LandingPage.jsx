import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import AlertMessage from '../components/ui/AlertMessage'
import FormularioContacto from '../components/contacto/FormularioContacto'
import InstallAppButton from '../components/pwa/InstallAppButton'

const imagenesLanding = [
  { src: '/agro-campo-valle.jpeg', alt: 'Vista amplia de parcelas de cultivo entre montañas al atardecer.', etiqueta: 'Cada parcela, una historia' },
  { src: '/agro-campo-hongos.jpeg', alt: 'Hongos recién cosechados mientras una persona consulta Agro en su teléfono.', etiqueta: 'Observa cada detalle' },
  { src: '/agro-campo-flor.jpeg', alt: 'Flores creciendo en un campo preparado para el cultivo.', etiqueta: 'Cultiva con paciencia' },
  { src: '/agro-campo-cempasuchil.jpeg', alt: 'Campo de flores de cempasúchil en temporada de cosecha.', etiqueta: 'El esfuerzo florece' },
  { src: '/agro-campo-labranza.jpeg', alt: 'Productor guiando caballos durante la preparación de la tierra.', etiqueta: 'Tradición que avanza' },
  { src: '/agro-campo-maiz.jpeg', alt: 'Productor revisando su parcela de maíz desde el teléfono.', etiqueta: 'Acompaña cada etapa' },
  { src: '/agro-campo.jpeg', alt: 'Productor revisando sus cultivos con una tableta en la parcela.', etiqueta: 'Decisiones desde el campo' },
]

export default function LandingPage() {
  const { state } = useLocation()
  const [imagenActiva, setImagenActiva] = useState(0)
  const [reproduciendo, setReproduciendo] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    if (!reproduciendo) return undefined
    const intervalo = window.setInterval(() => {
      setImagenActiva((actual) => (actual + 1) % imagenesLanding.length)
    }, 6500)
    return () => window.clearInterval(intervalo)
  }, [reproduciendo])

  function seleccionarImagen(indice) {
    setImagenActiva((indice + imagenesLanding.length) % imagenesLanding.length)
    setReproduciendo(false)
  }

  return (
    <>
      <header className="public-nav">
        <Link className="brand" to="/"><span className="brand__mark" />AGRO</Link>
        <nav className="public-nav__links" aria-label="Acceso">
          <Link to="/login">Iniciar sesión</Link>
          <InstallAppButton />
          <Link to="/registro"><BaseButton>Crear cuenta</BaseButton></Link>
        </nav>
      </header>
      <main>
        {state?.avisoSesion && <div className="page-shell"><AlertMessage title="Cierre de sesión" tone="warning">{state.avisoSesion}</AlertMessage></div>}
        <section className="hero hero--immersive">
          <div className="hero__visual">
            <img key={imagenesLanding[imagenActiva].src} src={imagenesLanding[imagenActiva].src} alt={imagenesLanding[imagenActiva].alt} fetchPriority={imagenActiva === 0 ? 'high' : 'auto'} />
          </div>
          <div className="hero__content">
            <div className="hero__copy">
              <span className="eyebrow">GESTIÓN AGRÍCOLA, A TU RITMO</span>
              <h1>Tu campo,<br /><em>en orden.</em></h1>
              <p>Cuida cada etapa de tus cultivos desde un solo lugar.</p>
              <div className="hero__actions">
                <Link to="/registro"><BaseButton>Comenzar ahora <span aria-hidden="true">→</span></BaseButton></Link>
                <Link className="hero__login" to="/login">Ya tengo una cuenta</Link>
              </div>
              <div className="hero__features" aria-label="Herramientas de Agro"><span>Cultivos</span><span>Actividades</span><span>Fotografías</span></div>
            </div>
          </div>
          <div className="hero__carousel" role="group" aria-label="Carrusel de imágenes del campo" onMouseEnter={() => setReproduciendo(false)} onFocusCapture={() => setReproduciendo(false)}>
            <span className="hero__carousel-caption">{imagenesLanding[imagenActiva].etiqueta}</span>
            <div className="hero__carousel-controls">
              <button type="button" className="hero__carousel-arrow" aria-label="Imagen anterior" onClick={() => seleccionarImagen(imagenActiva - 1)}>‹</button>
              <span className="hero__carousel-count" aria-hidden="true">{String(imagenActiva + 1).padStart(2, '0')} <span>/</span> {String(imagenesLanding.length).padStart(2, '0')}</span>
              <button type="button" className="hero__carousel-arrow" aria-label="Imagen siguiente" onClick={() => seleccionarImagen(imagenActiva + 1)}>›</button>
              <button type="button" className="hero__carousel-toggle" aria-label={reproduciendo ? 'Pausar carrusel' : 'Reproducir carrusel'} aria-pressed={!reproduciendo} onClick={() => setReproduciendo((actual) => !actual)}>{reproduciendo ? 'Ⅱ' : '▶'}</button>
            </div>
            <div className="hero__carousel-dots" aria-label="Elegir imagen">
              {imagenesLanding.map((imagen, indice) => <button type="button" key={imagen.src} aria-label={`Mostrar imagen ${indice + 1}: ${imagen.etiqueta}`} aria-current={imagenActiva === indice ? 'true' : undefined} onClick={() => seleccionarImagen(indice)} />)}
            </div>
          </div>
        </section>
        <details className="public-contact" id="contacto">
          <summary>¿Necesitas ayuda? <strong>Contáctanos</strong></summary>
          <div className="public-contact__form"><FormularioContacto /></div>
        </details>
      </main>
      <footer className="public-footer">
        <Link className="brand" to="/"><span className="brand__mark" />AGRO</Link>
        <span>El seguimiento de tus cultivos, en un solo lugar.</span>
        <a href="#contacto">Ayuda</a>
      </footer>
    </>
  )
}
