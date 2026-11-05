import { solicitarAutenticada } from './autenticacion.js'
import { limpiarSesion } from './sesion.js'

// El cierre local no espera indefinidamente a una conexión lenta.
export async function cerrarSesion() {
  const controller = new AbortController()
  let timeout
  let confirmado = false
  try {
    await Promise.race([
      solicitarAutenticada('/api/auth/logout', { method: 'POST', signal: controller.signal }),
      new Promise((_, reject) => { timeout = setTimeout(() => { controller.abort(); reject(new Error('Tiempo agotado')) }, 10000) }),
    ])
    confirmado = true
  } catch {
    // Un error no significa que el servidor haya revocado la sesión.
  } finally {
    clearTimeout(timeout)
    limpiarSesion()
  }
  return { confirmado }
}
