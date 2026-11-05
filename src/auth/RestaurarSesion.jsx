import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { verificarSesionGuardada } from './autenticacion'
import { obtenerSesion } from './sesion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'

export default function RestaurarSesion() {
  const [estado, setEstado] = useState(() => obtenerSesion() ? 'comprobando' : 'sin-sesion')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true
    setEstado(obtenerSesion() ? 'comprobando' : 'sin-sesion')
    verificarSesionGuardada().then((resultado) => { if (activo) setEstado(resultado) })
    return () => { activo = false }
  }, [intento])

  useEffect(() => {
    const reintentar = () => setIntento((actual) => actual + 1)
    window.addEventListener('online', reintentar)
    return () => window.removeEventListener('online', reintentar)
  }, [])

  if (estado === 'comprobando') return <main className="page-shell" role="status">Comprobando sesión…</main>
  if (estado === 'valida') return <Navigate to="/app" replace />
  return <>
    {estado === 'no-disponible' && <div className="page-shell stack"><AlertMessage title="No se pudo verificar tu sesión" tone="warning">Comprueba tu conexión e inténtalo de nuevo. La sesión guardada no se ha eliminado.</AlertMessage><div><BaseButton variant="secondary" onClick={() => setIntento((actual) => actual + 1)}>Reintentar</BaseButton></div></div>}
    <Outlet />
  </>
}
