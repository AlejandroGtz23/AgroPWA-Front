import { Link } from 'react-router-dom'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'

export default function LandingPage() {
  return (
    <>
      <header className="public-nav">
        <Link className="brand" to="/"><span className="brand__mark" />AGRO</Link>
        <nav className="public-nav__links">
          <a href="#funciona">Cómo funciona</a><a href="#nosotros">Quiénes somos</a><a href="#acerca">Acerca de</a>
          <Link to="/login"><BaseButton>Iniciar sesión</BaseButton></Link>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div className="hero__content">
            <div>
              <span className="eyebrow">P01 · Inicio público para la gestión de cultivos</span>
              <h1>Tus cultivos en un solo lugar, solo aqui</h1>
              <p>Registra, consulta y da seguimiento a tus cultivos incluso cuando estás en el campo y no tienes conexión a Internet.</p>
              <div className="row"><Link to="/registro"><BaseButton>Regístrate</BaseButton></Link><Link to="/login"><BaseButton variant="secondary">Inicia sesión</BaseButton></Link></div>
            </div>
            <div className="hero__art" aria-hidden="true" />
          </div>
        </section>
        <section id="funciona" className="page-shell">
          <div className="page-heading"><span className="eyebrow">Una herramienta que te acompaña</span><h2>¿Cómo funciona?</h2><p>Un flujo sencillo pensado para registrar lo importante directamente desde el campo.</p></div>
          <div className="grid grid--cards">
            {[
              ['Registra tu cultivo y parcela', 'Crea un registro con el nombre del cultivo, la ubicación y la fecha de siembra para tener una base clara desde el primer día.'],
              ['Da seguimiento en cada visita', 'Anota riegos, fertilizaciones, avances y observaciones. También puedes agregar fotografías como evidencia del trabajo realizado.'],
              ['Trabaja sin conexión', 'Si no tienes Internet, tus registros se guardan de forma segura en el dispositivo para que sigas trabajando sin interrupciones.'],
              ['Sincroniza cuando regreses a línea', 'Al recuperar la conexión, revisa los elementos pendientes y sincronízalos para mantener tu información actualizada.'],
              ['Consulta el historial de tu parcela', 'Visualiza las actividades de cada cultivo y toma decisiones con el contexto de lo que ya hiciste durante la temporada.'],
              ['Mantén todo en un solo lugar', 'Evita notas dispersas y conserva la información de tus cultivos disponible cuando la necesites.'],
            ].map(([title, description], index) => <BaseCard key={title} className="feature-card"><span className="feature-card__number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></BaseCard>)}
          </div>
        </section>
        <section id="nosotros" className="landing-section landing-section--tint">
          <div className="landing-section__content landing-story">
            <div className="page-heading">
              <span className="eyebrow">Quiénes somos</span>
              <h2>Construimos tecnología útil para el trabajo agrícola.</h2>
              <p>Agro nace para acercar el registro y seguimiento de cultivos a productores que necesitan herramientas prácticas, claras y disponibles aun fuera de cobertura.</p>
            </div>
            <div className="landing-story__body">
              <p>Entendemos que la jornada no ocurre frente a un escritorio: sucede entre parcelas, recorridos y decisiones que no pueden esperar. Por eso diseñamos una experiencia sencilla, pensada para capturar información en el momento en que sucede.</p>
              <p>Buscamos que cada productor tenga mayor control sobre su operación, conserve la historia de sus cultivos y pueda convertir los registros cotidianos en mejores decisiones para la siguiente etapa.</p>
            </div>
          </div>
        </section>
        <section id="acerca" className="page-shell landing-section__content">
          <div className="page-heading landing-section__intro">
            <span className="eyebrow">Acerca de Agro</span>
            <h2>Información de campo, siempre a la mano.</h2>
            <p>Una aplicación web progresiva para organizar el seguimiento de cultivos de forma simple, incluso cuando la conectividad es limitada.</p>
          </div>
          <div className="about-grid">
            <BaseCard className="about-card"><h3>Hecha para el campo</h3><p>Flujos directos y formularios fáciles de usar desde el teléfono, para registrar datos sin complicaciones durante la jornada.</p></BaseCard>
            <BaseCard className="about-card"><h3>Disponible sin Internet</h3><p>La información puede guardarse localmente mientras no hay señal y sincronizarse después, para que una mala conexión no detenga tu trabajo.</p></BaseCard>
            <BaseCard className="about-card"><h3>Seguimiento con contexto</h3><p>Reúne cultivos, actividades y evidencias en un mismo historial para consultar qué pasó en cada parcela cuando lo necesites.</p></BaseCard>
          </div>
          <div className="landing-cta">
            <div><h2>Empieza a llevar el control de tus cultivos.</h2><p>Crea tu cuenta y registra tu primer cultivo en pocos pasos.</p></div>
            <Link to="/registro"><BaseButton>Crear una cuenta</BaseButton></Link>
          </div>
        </section>
      </main>
    </>
  )
}
