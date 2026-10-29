const env = import.meta.env || {}
const apiUrl = env.VITE_API_URL || (env.PROD
  ? 'https://agropwa-api-cfcfcdbhdddqh7a7.centralus-01.azurewebsites.net'
  : 'https://localhost:7095')

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export async function solicitarApi(path, options = {}) {
  let response
  try {
    response = await fetch(`${apiUrl.replace(/\/+$/, '')}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    })
  } catch {
    throw new ApiError('No fue posible conectar con el servidor. Verifica tu conexión e intenta nuevamente.', 0)
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.title || 'Ocurrió un error. Intenta nuevamente.', response.status, data?.errores || {})
  }
  return data
}

export function registrarUsuario(datos) {
  return solicitarApi('/api/auth/registro', { method: 'POST', body: JSON.stringify(datos) })
}

export function comprobarSalud() {
  return solicitarApi('/api/salud', { cache: 'no-store' })
}

export function iniciarSesion(datos) {
  return solicitarApi('/api/auth/login', { method: 'POST', body: JSON.stringify(datos) })
}

export function renovarSesion(refreshToken) {
  return solicitarApi('/api/auth/renovar', { method: 'POST', body: JSON.stringify({ refreshToken }) })
}
