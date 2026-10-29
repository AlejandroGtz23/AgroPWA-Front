const SESSION_KEY = 'agro.sesion'

function leer(storage) {
  try {
    const data = JSON.parse(storage.getItem(SESSION_KEY))
    return data?.accessToken && data?.refreshToken && data?.usuario?.id && data?.expiraUtc ? data : null
  } catch { return null }
}

export function obtenerSesion() {
  return leer(sessionStorage) || leer(localStorage)
}

export function esRecordada() {
  return !leer(sessionStorage) && Boolean(leer(localStorage))
}

export function guardarSesion(sesion, recordarme = false) {
  if (!sesion?.accessToken || !sesion?.refreshToken || !sesion?.usuario?.id || !sesion?.expiraUtc) throw new Error('La respuesta de sesión no es válida.')
  const destino = recordarme ? localStorage : sessionStorage
  const anterior = recordarme ? sessionStorage : localStorage
  destino.setItem(SESSION_KEY, JSON.stringify(sesion))
  anterior.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('agro-sesion'))
}

export function limpiarSesion() {
  sessionStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('agro-sesion'))
}

export function esCambioSesion(event) {
  return event.key === SESSION_KEY || event.key === null
}
