import { ApiError, renovarSesion, solicitarApi } from '../api/cliente.js'
import { esRecordada, guardarSesion, limpiarSesion, obtenerSesion } from './sesion.js'

let renovacionPendiente

async function renovarConToken(tokenAnterior) {
  const actual = obtenerSesion()
  if (!actual) throw new ApiError('Tu sesión terminó. Inicia sesión de nuevo.', 401)
  if (actual.refreshToken !== tokenAnterior) return actual
  try {
    const nueva = await renovarSesion(tokenAnterior)
    // Una sesión sustituida durante la petición nunca debe ser restaurada.
    if (obtenerSesion()?.refreshToken !== tokenAnterior) throw new ApiError('La sesión cambió. Intenta de nuevo.', 0)
    guardarSesion(nueva, esRecordada())
    return nueva
  } catch (error) {
    if (error.status === 401 && obtenerSesion()?.refreshToken === tokenAnterior) limpiarSesion()
    throw error
  }
}

export function renovar() {
  if (renovacionPendiente) return renovacionPendiente
  const sesion = obtenerSesion()
  if (!sesion) return Promise.reject(new ApiError('Tu sesión terminó. Inicia sesión de nuevo.', 401))
  const recordada = esRecordada()
  if (recordada && !navigator.locks?.request) {
    return Promise.reject(new ApiError('No se pudo renovar la sesión de forma segura en este navegador. Inicia sesión de nuevo.', 0))
  }
  renovacionPendiente = (recordada
    ? navigator.locks.request('agro-renovar-sesion', () => renovarConToken(sesion.refreshToken))
    : renovarConToken(sesion.refreshToken)
  ).finally(() => { renovacionPendiente = undefined })
  return renovacionPendiente
}

export async function solicitarAutenticada(path, options = {}) {
  let sesion = obtenerSesion()
  if (!sesion) throw new ApiError('Tu sesión terminó. Inicia sesión de nuevo.', 401)
  const expiracion = Date.parse(sesion.expiraUtc)
  if (!Number.isFinite(expiracion) || expiracion <= Date.now() + 30000) sesion = await renovar()
  const solicitar = (token) => solicitarApi(path, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } })
  try {
    return await solicitar(sesion.accessToken)
  } catch (error) {
    if (error.status !== 401) throw error
    const actual = obtenerSesion()
    if (!actual) throw error
    // Si otra petición ya renovó, usar primero el token nuevo.
    const nueva = actual.refreshToken !== sesion.refreshToken ? actual : await renovar()
    try { return await solicitar(nueva.accessToken) } catch (retryError) {
      if (retryError.status === 401 && obtenerSesion()?.refreshToken === nueva.refreshToken) limpiarSesion()
      throw retryError
    }
  }
}
