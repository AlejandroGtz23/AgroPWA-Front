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
              <span className="eyebrow">P01 · Inicio público</span>
              <h1>Tus cultivos en un solo lugar</h1>
              <p>Registra, consulta y da seguimiento a tus cultivos incluso cuando estás en el campo y no tienes conexión a Internet.</p>
              <div className="row"><Link to="/registro"><BaseButton>Regístrate</BaseButton></Link><Link to="/login"><BaseButton variant="secondary">Inicia sesión</BaseButton></Link></div>
            </div>
            <div className="hero__art" aria-hidden="true" />
          </div>
        </section>
        <section id="funciona" className="page-shell">
          <div className="page-heading"><h2>¿Cómo funciona?</h2><p>Un flujo sencillo pensado para trabajar directamente en el campo.</p></div>
          <div className="grid grid--cards">
            {['Registra tu cultivo y parcela', 'Trabaja sin conexión', 'Sincroniza al recuperar Internet'].map((text, index) => <BaseCard key={text}><span className="eyebrow">0{index + 1}</span><h3>{text}</h3></BaseCard>)}
          </div>
        </section>
      </main>
    </>
  )
}
