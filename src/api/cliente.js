const env = import.meta.env || {}
const apiUrl = env.VITE_API_URL || (env.PROD
  ? 'https://agropwa-api-cfcfcdbhdddqh7a7.centralus-01.azurewebsites.net'
  : 'https://localhost:7095')

let comprobacionSaludEnCurso = null
let ultimaComprobacionSalud = null

function mensajeHttp(status) {
  if (status === 400) return 'No se pudieron validar los datos enviados. Revisa los campos del formulario y vuelve a intentarlo.'
  if (status === 401) return 'No se pudo validar tu acceso. Inicia sesión nuevamente para continuar.'
  if (status === 403) return 'Tu cuenta no tiene permiso para completar esta acción. Si necesitas acceso, consulta al equipo de Agro.'
  if (status === 404) return 'No encontramos la información solicitada. Regresa a la lista y actualízala para continuar.'
  if (status === 409) return 'La información cambió o esta acción ya se realizó. Actualiza la vista antes de volver a guardar.'
  if (status === 413) return 'El archivo supera el tamaño permitido. Selecciona uno más pequeño e inténtalo de nuevo.'
  if (status === 429) return 'Has realizado varias solicitudes en poco tiempo. Espera un momento antes de intentarlo otra vez.'
  if (status >= 500) return 'Agro no pudo confirmar esta operación. Conserva esta pantalla y revisa el resultado antes de volver a enviarla.'
  return 'No se completó la solicitud. Revisa la información y vuelve a intentarlo.'
}

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
    const headers = { Accept: 'application/json', ...options.headers }
    if (options.body instanceof FormData) {
      Object.keys(headers).filter((name) => name.toLowerCase() === 'content-type').forEach((name) => delete headers[name])
    } else if (options.body && !Object.keys(headers).some((name) => name.toLowerCase() === 'content-type')) {
      headers['Content-Type'] = 'application/json'
    }
    response = await fetch(`${apiUrl.replace(/\/+$/, '')}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new ApiError('No pudimos comunicarnos con Agro. Revisa tu conexión y vuelve a intentarlo. Si acabas de enviar cambios, confirma el resultado antes de reenviarlos.', 0)
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.title || mensajeHttp(response.status), response.status, data?.errores || {})
  }
  return data
}

export function registrarUsuario(datos) {
  return solicitarApi('/api/auth/registro', { method: 'POST', body: JSON.stringify(datos) })
}

export function comprobarSalud({ renovar = false } = {}) {
  if (!renovar && ultimaComprobacionSalud) {
    return Promise.resolve(ultimaComprobacionSalud)
  }
  if (comprobacionSaludEnCurso) return comprobacionSaludEnCurso

  comprobacionSaludEnCurso = solicitarApi('/api/salud', { cache: 'no-store' })
    .then((data) => {
      ultimaComprobacionSalud = data?.estado === 'OK' ? data : null
      return data
    })
    .catch((error) => {
      ultimaComprobacionSalud = null
      throw error
    })
    .finally(() => {
      comprobacionSaludEnCurso = null
    })
  return comprobacionSaludEnCurso
}

export function iniciarSesion(datos) {
  return solicitarApi('/api/auth/login', { method: 'POST', body: JSON.stringify(datos) })
}

export function solicitarRecuperacionContrasena(correo) {
  return solicitarApi('/api/auth/recuperar', { method: 'POST', body: JSON.stringify({ correo }) })
}

export function restablecerContrasena(token, contrasenaNueva) {
  return solicitarApi('/api/auth/restablecer', {
    method: 'POST',
    body: JSON.stringify({ token, contrasenaNueva }),
  })
}

export function renovarSesion(refreshToken) {
  return solicitarApi('/api/auth/renovar', { method: 'POST', body: JSON.stringify({ refreshToken }) })
}
