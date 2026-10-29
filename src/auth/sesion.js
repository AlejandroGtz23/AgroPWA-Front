const SESSION_KEY = 'agro.sesion'

// La sesión se conserva en esta pestaña, no entre cierres del navegador.
export function guardarSesion(sesion) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion))
}
