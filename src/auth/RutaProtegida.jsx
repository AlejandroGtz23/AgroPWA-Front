import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { solicitarAutenticada } from './autenticacion'
import { esCambioSesion, obtenerSesion } from './sesion'
import AlertMessage from '../components/ui/AlertMessage'
import BaseButton from '../components/ui/BaseButton'

export default function RutaProtegida() {
  const [estado, setEstado] = useState('comprobando')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true
    if (!obtenerSesion()) { setEstado('sin-sesion'); return undefined }
    setEstado('comprobando')
    solicitarAutenticada('/api/auth/yo').then(() => {
      if (activo) setEstado('valida')
    }).catch((error) => {
      if (activo) setEstado(error.status === 401 || !obtenerSesion() ? 'sin-sesion' : 'sin-conexion')
    })
    return () => { activo = false }
  }, [intento])

  useEffect(() => {
    const actualizar = (event) => { if (event.type !== 'storage' || esCambioSesion(event)) setIntento((value) => value + 1) }
    window.addEventListener('storage', actualizar)
    window.addEventListener('online', actualizar)
    window.addEventListener('agro-sesion', actualizar)
    return () => { window.removeEventListener('storage', actualizar); window.removeEventListener('online', actualizar); window.removeEventListener('agro-sesion', actualizar) }
  }, [])

  if (estado === 'sin-sesion') return <Navigate to="/login" replace state={{ mensaje: 'Inicia sesión para acceder a tu cuenta.' }} />
  if (estado === 'comprobando') return <main className="page-shell">Comprobando sesión…</main>
  if (estado === 'sin-conexion') return <main className="page-shell stack"><AlertMessage title="No se pudo verificar la sesión" tone="warning">Comprueba tu conexión y vuelve a intentarlo. El acceso a datos sin conexión aún no está disponible.</AlertMessage><div><BaseButton onClick={() => setIntento((value) => value + 1)}>Reintentar</BaseButton> <Link to="/login">Volver al inicio de sesión</Link></div></main>
  return <Outlet />
}
